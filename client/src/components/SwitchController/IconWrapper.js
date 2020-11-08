import React, {useEffect, useState} from 'react';
import AcUnitIcon from "@material-ui/icons/AcUnit";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import ToysIcon from "@material-ui/icons/Toys";
import OpacityIcon from "@material-ui/icons/Opacity";
import {store} from "../../redux/store";
import {ColorCircularProgress} from "../utils/ColorCircularProgress";
import './FanOut.css'
import {checkEmpty} from "../utils/CheckEmpty";
import socket from "../../socket";

const {colors} = require('root/values/colors');

const CustomCoolerIcon = ({active}) => {
  return JSON.parse(active) ? <AcUnitIcon style={{color: colors['coolerIcon'], borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515)', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}} />
    : <AcUnitIcon style={{borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}}/>
};

const CustomWhatshotIcon = ({active}) => {
  return JSON.parse(active) ? <WhatshotIcon style={{color: colors['heaterIcon'], borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515)', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}} />
  : <WhatshotIcon style={{borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}}/>
};

const CustomWbSunnyIcon = ({active}) => {
  return JSON.parse(active) ? <WbSunnyIcon style={{color: colors['ledIcon'], borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515)', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}} /> :
    <WbSunnyIcon  style={{borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}}/>
};

const CustomOpacityIcon = ({active}) => {
  return JSON.parse(active) ? <OpacityIcon style={{color: colors['waterpumpIcon'], borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515)', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}} />
  : <OpacityIcon style={{borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}} />
};

const CustomToysIcon = ({active}) => {
  return JSON.parse(active) ? <ToysIcon style={{borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515)', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}} className="spin" /> : <ToysIcon style={{borderRadius : '50%',background: 'linear-gradient(225deg, #181919, #141515', boxShadow:  '6px 6px 12px #0b0b0b,-6px -6px 12px #212323'}}/>
};

const defaultIcons = {
  "cooler" : <AcUnitIcon />,
  "heater" : <WhatshotIcon />,
  "led" : <WbSunnyIcon  />,
  "fan" : <ToysIcon />,
  "waterpump": <OpacityIcon />
}

export default function IconWrapper({machine}) {
  const [animation, setAnimation] = useState(false);
  const [icon ,setIcon] = useState(defaultIcons[machine]);
  const [isLoading, setIsLoading] = React.useState(true);


  const getIcon = (machine, active) => {
    const icons = {
      "cooler" : <CustomCoolerIcon active={active.toString()} />,
      "heater" : <CustomWhatshotIcon active={active.toString()} />,
      "led" : <CustomWbSunnyIcon active={active.toString()} />,
      "fan" : <CustomToysIcon active={active.toString()} />,
      "waterpump": <CustomOpacityIcon active={active.toString()} />
    }
    return icons[machine]
  }

  const receiveSocket = () => {
    socket.on('receiveSwitchControl', (switchStatus) => {
      if(machine === switchStatus.machine){
        setAnimation(switchStatus.status);
      }})
  }

  const cleanup = () => {
    socket.disconnect();
  }

  useEffect(() => {
    receiveSocket();
    return () => cleanup();
  }, [machine]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const activeSwitch = store.getState()['controlSwitch'][machine]
      if(!checkEmpty(activeSwitch)) { setAnimation(activeSwitch); }
    })
    return () => { unsubscribe(); }
  }, [])

  useEffect(() => {
    const activeSwitch = store.getState()['controlSwitch'][machine]
    if(!checkEmpty(activeSwitch)) {
      setAnimation(activeSwitch);
    }
  }, []);

  useEffect(() => {
    if(!checkEmpty(animation)){
      setIcon(getIcon(machine, animation))
      setIsLoading(false);
    }
  }, [animation])

  if(isLoading){ return <ColorCircularProgress /> }
  else {return icon}
}