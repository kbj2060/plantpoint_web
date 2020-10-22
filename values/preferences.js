module.exports = {
  // TODO [SERVER CHANGE] : IP & SOCKET_HOST in automation/preferences.json
  ip : "121.157.207.47",
  mqttPort : "1883",
  socketIoPort : "9000",
  pages : [
    'dashboard', 'logout'
  ],
  machines: [
    'cooler', 'heater', 'led', 'fan', 'waterpump'
  ],
  n_machines: {
    'heater': 2,
    'cooler': 2,
    'led': 4,
    'waterpump': 1,
    'fan' : 4,
  },
  environments: [
    'co2', 'humidity', 'temperature'
  ],
  plants: [
    '1', '2', '3'
  ],
  autoItem: [
    'led', 'heater','cooler', 'fan', 'waterpump'
  ],
  settingType: {
    'fan' : 'cycle',
    'waterpump' : 'cycle',
    'cooler' : 'range',
    'heater' : 'range',
    'led' : 'range',
  },
}
