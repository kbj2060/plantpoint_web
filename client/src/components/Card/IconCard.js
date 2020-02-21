import React from 'react';
import Card from '@material-ui/core/Card';

import Co2Icon from 'assets/icons/Co2Icon';
import TemperatureIcon from 'assets/icons/TemperatureIcon';
import HumidityIcon from 'assets/icons/HumidityIcon';
import PHIcon from 'assets/icons/PHIcon';
import ECIcon from 'assets/icons/ECIcon';
import LedIcon from 'assets/icons/LedIcon';

import useStyles from 'assets/jss/dashboardStyle.js'

const colors = {
  co2 : {backgroundColor : 'white'},
  temp : {backgroundColor : 'white'},
  hum : {backgroundColor : 'white'},
  ph : {backgroundColor : 'white'},
  ec : {backgroundColor : 'white'},
  led : {backgroundColor : 'white'},
};

export default function ControlIcon(props) {
  const {color, ...rest} = props;
  const classes = useStyles(colors[color]);
  const cardClass = Object.keys(rest)[0];

  const cardClassList = {
    'Co2Icon' : <Co2Icon />,
    'TemperatureIcon' : <TemperatureIcon />,
    'HumidityIcon' : <HumidityIcon />,
    'PHIcon' : <PHIcon />,
    'ECIcon' : <ECIcon />,
    'LedIcon' : <LedIcon />,
  }

  return (
        <Card className={classes.iconCard}>
          {cardClassList[cardClass]}
        </Card>
    );
}
