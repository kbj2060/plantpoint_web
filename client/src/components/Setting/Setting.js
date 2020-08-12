import React, {useEffect, useState} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import axios from "axios";
import {ColorCircularProgress} from "../utils/ColorCircularProgress"
import ValueLabel from "@material-ui/core/Slider/ValueLabel";


const StyledValueLabel = withStyles({
  label: {
    color : '#1E2425'
  }
})(ValueLabel);

const CustomSlider = withStyles({
  valueLabel: {
    fontSize: '15px',
    fontWeight : '500'
  },
})(Slider);


const useStyles = makeStyles({
  root: {
    width: 'auto',
    padding: '0 5% 0 5%'
  },
  slider :{
    color : "#FFCB3A",
  },
  title : {
    marginBottom : '40px',
    color:'white'
  },

});

function valuetext(value) {
  return `${value}°C`;
}

export default function Setting(props) {
  const { environment, isApplied, getSettingFromSlider } = props;
  const classes = useStyles();
  const [setting, setSetting] = React.useState([0, 0]);
  const [isLoading, setIsLoading] = React.useState(true);
  const {settingRange, environmentsWordTable } = require('../../PROPERTIES');

  const giveSetting = () => {
    getSettingFromSlider({[environment]: setting});
  }

  const handleMinMaxSetting = (environment) => {
    let names = [];
    ['min', 'max'].forEach((MinMax) => {
      names.push(`${environment}_${MinMax}`);
    })
    return names
  }

  const getSettings = async () => {
    await axios.get('api/getStatus', {
      params : {
        table : 'setting',
        selects : handleMinMaxSetting(environment),
        num : 1
      }
    }).then(({data}) => {
      setSetting([data[0][`${environment}_min`], data[0][`${environment}_max`]])
      setIsLoading(false);
    })
  }

  useEffect(() => {
    if(isApplied){ giveSetting(); }
  }, [isApplied])

  useEffect(() => {
    getSettings();
  }, [])

  const handleChange = (event, newValue) => {
    setSetting(newValue);
  };

  if(isLoading){
    return <ColorCircularProgress></ColorCircularProgress>
  }

  return (
    <div className={classes.margin}>
      <Grid className={classes.root}>
        <Typography className={classes.title}>
          {environmentsWordTable[environment]}
        </Typography>
        <CustomSlider
          className={classes.slider}
          min={settingRange[environment][0]}
          max={settingRange[environment][1]}
          value={setting}
          onChange={handleChange}
          ValueLabelComponent={StyledValueLabel}
          valueLabelDisplay="on"
          aria-labelledby="range-slider"
          getAriaValueText={valuetext}
        />
      </Grid>
    </div>
  );
}