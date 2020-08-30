import pymysql
import time
import paho.mqtt.client as mqtt
import json
import os

#os.chdir("/home/pi/hydroponics")
with open(os.getcwd() + "/../server/db_conf.json") as json_file:
    conf = json.load(json_file)

host = conf['host']
user = conf['user']
password = conf['password']

MQTT_PORT = 1883
#MQTT_HOST = "192.168.0.3"
MQTT_HOST = "localhost"
CLIENT_ID = 'Auto'

min_index, max_index = 0, 1

LED_TOPIC = "switch/led"
AC_TOPIC = "switch/airconditioner"


class MQTT():
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("connected OK")
        else:
            print("Bad connection Returned code=", rc)

    def on_disconnect(self, client, userdata, flags, rc=0):
        print(str(rc))

    def on_publish(self, client, userdata, mid):
        print("In on_pub callback mid= ", mid)


class Automagic(MQTT):
    def __init__(self):
        self.settings = {"co2": [], "temperature": [], "humidity": [], "led": []}
        self.environments = {"temperature": 0, "humidity": 0, "co2": 0}
        self.machines = {"airconditioner": 0, "led": 0, "fan": 0, "waterpump": 0}
        self.sections = ['1', '2', '3']

        self.conn = pymysql.connect(host=host, user=user, password=password, charset='utf8')
        self.cursor = self.conn.cursor()

        self.client = mqtt.Client(client_id=CLIENT_ID)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.client.on_publish = self.on_publish
        self.client.connect(MQTT_HOST, MQTT_PORT)
        self.client.loop_start()

        self.fetch_machines()
        self.fetch_settings()
        self.fetch_environments_mean()

    def make_environments_sql(self):
        sqls = []
        selects = ",".join(list(self.environments.keys()))
        for section in self.sections:
            sqls.append(f"(SELECT {selects} FROM iot.env WHERE section = \"{section}\"ORDER BY id DESC LIMIT 1)")
        return " UNION ALL ".join(sqls)

    def make_settings_sql(self):
        sqls = []
        for setting in self.settings.keys():
            sqls.append(f"(SELECT category, `min`,`max`  FROM iot.setting WHERE category = \"{setting}\" ORDER BY id DESC LIMIT 1)")
        return " UNION ALL ".join(sqls)

    def make_machine_sql(self):
        sqls = []
        for machine in self.machines.keys():
            sqls.append(f"(SELECT machine, status  FROM iot.switch WHERE machine = \"{machine}\" ORDER BY id DESC LIMIT 1)")
        return " UNION ALL ".join(sqls)

    def fetch_environments_mean(self):
        sql = self.make_environments_sql()
        self.cursor.execute(sql)
        fetch = self.cursor.fetchall()
        mean_fetch = [sum(ele) / len(fetch) for ele in zip(*fetch)]
        for (index, key) in enumerate(self.environments.keys()):
            self.environments[key] = mean_fetch[index]

    def fetch_settings(self):
        sql = self.make_settings_sql()
        self.cursor.execute(sql)
        fetch = self.cursor.fetchall()
        for row in fetch:
            category = row[0]
            self.settings[category] = list(row[1:])

    def fetch_machines(self):
        sql = self.make_machine_sql()
        self.cursor.execute(sql)
        fetch = self.cursor.fetchall()
        for row in fetch:
            machine = row[0]
            self.machines[machine] = row[1]

    def insert_database(self, machine, status, ac_type=None):
        if ac_type:
            name = f"Auto({ac_type})"
        else:
            name = "Auto"
        sql = f"INSERT INTO iot.switch VALUES (null, \"{machine}\", {status}, \"{name}\", now(), 0)"
        self.cursor.execute(sql)

    @staticmethod
    def check_cooler_on(machine_power):
        return machine_power == 2
    @staticmethod
    def check_boiler_on(machine_power):
        return machine_power == 3

    def check_temperature(self, upper, lower):
        return lower < upper

    def temp_control(self):
        current_value = self.environments['temperature']
        ac_status = self.machines['airconditioner']
        off, cool, hot = 0, 2, 3

        _min = self.settings['temperature'][min_index]
        _max = self.settings['temperature'][max_index]
        _mean = (_min + _max) / 2

        # 난방
        if not self.check_boiler_on(ac_status) and self.check_temperature(upper=_min,
                                                                          lower=current_value):
            print("AirConditioner Boiler ON")
            self.insert_database(machine="airconditioner", status=hot, ac_type="H")
            self.client.publish(AC_TOPIC, hot)
        # 냉방
        elif not self.check_cooler_on(ac_status) and self.check_temperature(upper=current_value,
                                                                            lower=_max):
            print("AirConditioner Cooler ON")
            self.insert_database(machine="airconditioner", status=cool, ac_type="C")
            self.client.publish(AC_TOPIC, cool)
        elif self.check_boiler_on(ac_status) and self.check_temperature(upper=current_value,
                                                                        lower=_mean):
            print("AirConditioner Boiler OFF")
            self.insert_database(machine="airconditioner", status=off)
            self.client.publish(AC_TOPIC, off)
        elif self.check_cooler_on(ac_status) and self.check_temperature(upper=_mean,
                                                                        lower=current_value):
            print("AirConditioner Cooler OFF")
            self.insert_database(machine="airconditioner", status=off)
            self.client.publish(AC_TOPIC, off, qos=2)
        else:
            print('AirConditioner Do Nothing')


    @staticmethod
    def check_power_on(machine_power):
        return machine_power != 0

    def check_led_valid_hour(self, current_hour):
        return self.settings['led'][min_index] <= current_hour <= self.settings['led'][max_index]

    def led_control(self):
        current_hour = int(time.strftime('%H', time.localtime(time.time())))
        led_status = self.machines['led']
        off, on = 0, 1

        if self.check_led_valid_hour(current_hour) and not self.check_power_on(led_status):
            print("LED ON")
            self.insert_database(machine="led", status=on)
            self.client.publish(LED_TOPIC, on)
        elif not self.check_led_valid_hour(current_hour) and self.check_power_on(led_status):
            print("LED OFF")
            self.insert_database(machine="led", status=off)
            self.client.publish(LED_TOPIC, off)
        else:
            print('LED Do Nothing')

    def finish_automagic(self):
        self.conn.commit()
        self.conn.close()
        self.client.disconnect()


# TODO : 현재 조절 가능한 환경 변수는 온도와 조명 뿐.
auto = Automagic()

auto.led_control()
auto.temp_control()

auto.finish_automagic()
