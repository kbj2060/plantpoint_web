import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  icon:{
    height : 'auto',
    width : 'auto'
  }
}));

export default function ControlIcon(props) {
  const classes = useStyles();

  return (
  <SvgIcon className={classes.icon} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  fontSize='large' viewBox='0 0 512 512'>
  <g>
  	<g>
  		<path d="M341.333,288.593V85.333C341.333,38.205,303.128,0,256,0s-85.333,38.205-85.333,85.333v203.259
  			C144.48,312.03,128,346.091,128,384c0,70.693,57.308,128,128,128s128-57.307,128-128C384,346.091,367.52,312.03,341.333,288.593z
  			 M256,469.333c-47.128,0-85.333-38.205-85.333-85.333c0-24.637,10.441-47.492,28.455-63.615l14.212-12.72V85.333
  			c0-23.564,19.103-42.667,42.667-42.667s42.667,19.102,42.667,42.667v222.332l14.212,12.72
  			c18.014,16.123,28.455,38.977,28.455,63.615C341.333,431.128,303.128,469.333,256,469.333z"/>
  	</g>
  </g>
  <g>
  	<g>
  		<rect x="234.667" y="170.667" width="42.667" height="256"/>
  	</g>
  </g>
  <g>
  	<g>
  		<circle cx="256" cy="384" r="64"/>
  	</g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
</SvgIcon>
    );
}
