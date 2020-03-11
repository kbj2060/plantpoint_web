import React from 'react';
import {Line} from 'react-chartjs-2';
import useStyles from 'assets/jss/HistoryStyle';
import TimerIcon from 'assets/icons/TimerIcon';
import Typography from '@material-ui/core/Typography';
import { FIGURE_FEED } from 'resolvers/resolvers';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

const ColorCircularProgress = withStyles({
  root: {
    color: '#405C5A',
  },
})(CircularProgress);

export default function HistoryCard(props) {
  const { measurement } = props;
  const classes = useStyles();
  const { loading, error, data  } = useQuery(FIGURE_FEED, {variables : {
    orderBy: "updatedAt_ASC",
    filter : measurement,
    last: 60,
  }})
  
  const state = {
    labels: [],
    datasets: [
      {
        label: measurement,
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#D7A310',
        borderColor: '#D7A310',
        borderWidth: 1,
        data: []
      }
    ]
  }

  if (loading || error) { return <ColorCircularProgress size={40} thickness={4} /> }

  try {
    data.figureFeed.figures.forEach((currentValue, index) => {
      state.datasets[0].data.push(currentValue.value);
      state.labels.push(index);
    })
  } catch (error) {
    console.log("figure data error!")
  }
  console.log(data)

  return (
    <div className={classes.background}>
      <div className={classes.foreground}>
        <Line
          className={classes.chart}
          data={state}
          options={{
            title:{
            },
            legend: {
              display: false
            },
            responsive : true,
            maintainAspectRatio : false,
            color : '#405C5A',
            scales: {
              xAxes: [{
                gridLines: {color: "#405C5A"},
                ticks: {fontColor: '#405C5A'}
              }],
              yAxes: [{
                gridLines: { color: "#405C5A"},
                ticks: {fontColor: '#405C5A'}
              }]
            }}}
        />
      </div>
      <div className={classes.footer} >
        <Typography variant="body1" className={classes.textColor}>{measurement}</Typography>
        <Typography variant="body2" className={classes.textColor}>문제가 발견되지 않았습니다.</Typography>
        <div className={classes.updateInfo}>
          <TimerIcon />
          <Typography variant="inherit" className={classes.updateTime}>방금 갱신됨</Typography>
        </div>
      </div>
    </div>
    );
  }
