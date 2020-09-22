import React from 'react';
import Grid from "@material-ui/core/Grid";
import {CustomAntSwitch} from "../utils/CustomAntSwitch";
import {useDispatch} from "react-redux";
import {store} from "../../redux/store";
import {controlSetting} from "../../redux/modules/ControlSetting";
import update from "react-addons-update";
import {loadState} from "../LocalStorage";
import axios from 'axios';

export default function AutoSwitchWrapper({name:setting}) {
  const reduxSetting = store.getState()['controlSetting'][setting]
  const [status, setStatus] = React.useState(reduxSetting.enable);
  const dispatch = useDispatch();

  const postAutoSwitch = async (updatedStatus) => {
    const user = loadState()['authentication']['status']['currentUser'];
    await axios.post('/api/post/switch/auto', {
      params: {
        item : setting,
        status : updatedStatus,
        user : user
      }
    })
  }

  const handleChange = (event) => {
    event.persist();
    const updatedStatus = event.target.checked;
    const reduxSetting = store.getState()['controlSetting'][setting];
    setStatus(updatedStatus);
    dispatch(controlSetting({[setting]: update(reduxSetting, {
        enable: {$set: updatedStatus} })
    }));
    postAutoSwitch(updatedStatus)
      .then(r => console.log('auto switch updated!'));
  }

  return(
    <Grid container>
      <Grid item style={{color:'white',padding:'0.1rem'}}>끄기</Grid>
      <Grid item style={{display:'flex', alignItems:'center'}}>
        <CustomAntSwitch checked={status}
                         onChange={handleChange}
                         value={setting}
                         name={setting}/>
      </Grid>
      <Grid item style={{color:'white',padding:'0.1rem'}}>켜기</Grid>
    </Grid>
  )
}