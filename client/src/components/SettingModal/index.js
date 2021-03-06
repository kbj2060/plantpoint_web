import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from "@material-ui/core/Modal";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import withStyles from "@material-ui/core/styles/withStyles";
import Backdrop from "@material-ui/core/Backdrop";
import {makeStyles} from "@material-ui/core/styles";
import "../../assets/css/AutomationCircle.scss"
import CustomStepper from "./CustomStepper";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottom : '1px',
	},
	paper: {
		height: '100%',
		width : '100%',
		maxWidth: '500px',
		display : "flex",
		flexDirection: "column",
		padding : '10px 10px 0 10px',
		'&:focus': {
			outline: '0',
		}
	},
	menuButton : props => ({
		height : `${100/props.n_pages}%`,
		backgroundColor : 'rgba(255, 255, 255, 0)',
		border : 'none',
		width : '100%',
		color: 'white',
		textDecoration: 'none',
		outline : 'none',
		cursor : 'pointer',
		'&:hover' : { color : '#dec11e'},
		'&:active' : { transform : 'translateY(1px)'}
	}),
	autoButtonDiv : {
		width : '50px',
		height : '50px',
		borderRadius: '50%',
		background: props => props.customTheme,
		boxShadow: props => props.neumOutShadow,
		margin: 'auto',
		display : 'inline-flex',
		justifyContent : 'center',
		textAlign: 'center'
	},
	autoButtonText : {
		color : props => props.fontColor,
		margin: 'auto',
	},
	autoIcon : {
		color : props => props.defaultIconColor
	}
}));


const customBackdrop = withStyles(() => ({
	root : {
		backgroundColor : "rgba(0, 0, 0, 0.9)"
	}
}))(Backdrop)

export default function SettingModal() {
  	const [open, setOpen] = React.useState(false);
  	const {colors} = require('../../values/colors.json');
    const classes = useStyles({
			customTheme : colors.customTheme,
			neumOutShadow: colors.neumOutShadow,
			fontColor : colors.fontColor,
			defaultIconColor : colors.defaultIcon
		});

    const handleClose = () => {
      setOpen(false)
    }

    const AutoIconButton = () => {
    	const handleOpen = () => {
      	setOpen((prev) => !prev);
    	}

    	return (
    		<Button onClick={handleOpen} type="button">
					<AllInclusiveIcon className={classes.autoIcon}/>
        </Button>
			)
		}

    return(
		<ClickAwayListener onClickAway={handleClose}>
      <div className={classes.autoButtonDiv}>
        <AutoIconButton />
        <Modal className={classes.modal}
          disableAutoFocus={true}
          open={open}
          BackdropComponent={customBackdrop}
          BackdropProps={{timeout: 500}}>
				  <div className={classes.paper}>
						<CustomStepper modalClose={handleClose}/>
          </div>
        </Modal>
      </div>
		</ClickAwayListener>
    )
}