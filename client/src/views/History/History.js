import React from 'react';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';

import HistoryCard from 'components/Card/HistoryCard';
import useStyles from 'assets/jss/dashboardStyle';

export default function History() {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <CssBaseline />
        <Grid container style={{padding :'15px 30px 15px 30px'}}>
          <Grid item xs={12} sm={12} md={6} style={{padding:'15px',}}>
            <HistoryCard subject='온도' backgroundColor='#dadada'/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} style={{padding:'15px',}}>
            <HistoryCard subject='조명' backgroundColor='#dadada'/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} style={{padding:'15px',}}>
            <HistoryCard subject='CO2' backgroundColor='#dadada'/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} style={{padding:'15px',}}>
            <HistoryCard subject='습도' backgroundColor='#dadada'/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} style={{padding:'15px',}}>
            <HistoryCard subject='PH' backgroundColor='#dadada'/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} style={{padding:'15px',}}>
            <HistoryCard subject='EC' backgroundColor='#dadada'/>
          </Grid>
        </Grid>
      </div>
    )
  }