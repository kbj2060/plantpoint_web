import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import axios from "axios";
import {useSelector} from "react-redux";
import getCurrentPage from "../utils/getCurrentPage";
import {checkEmpty} from "../utils/CheckEmpty";

const theme = createMuiTheme({
  overrides: {
    MuiTableCell : {
      root : {
        borderBottom : 'none',
      }
    }
  },
});

const useStyles1 = makeStyles({
  root: {
    flexShrink: 0,
  },
});

function TablePaginationActions(props) {
	const {colors} = require('../../values/colors.json');
	const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
	onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
	onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
	onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
	onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

  return (
	<div className={classes.root}>
	<IconButton
    style={{color: colors.fontColor}}
		onClick={handleFirstPageButtonClick}
		disabled={page === 0}
		aria-label="first page">
		{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
		</IconButton>
	  <IconButton style={{color: colors.fontColor}} onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
		{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
	  </IconButton>
	  <IconButton style={{color: colors.fontColor}}
		onClick={handleNextButtonClick}
		disabled={page >= Math.ceil(count / rowsPerPage) - 1}
		aria-label="next page"
	  >
		{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
	  </IconButton>
	  <IconButton style={{color: colors.fontColor}}
		onClick={handleLastPageButtonClick}
		disabled={page >= Math.ceil(count / rowsPerPage) - 1}
		aria-label="last page"
	  >
		{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
	  </IconButton>
	</div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
	root: {
		flexShrink: 0,
	},
	container : {
		borderRadius: '20px',
		boxShadow: props => props.neumOutShadow,
		background : props => props.customTheme,
		height: '100%'
	},
	text : {
		color : props => props.fontColor,
		fontWeight : 'bold',
	},
	statusOn : {
		color : props => props.colorOn
	},
	statusOff : {
		color : props => props.colorOff
	},
	table : {
		height: '100%'
	},
	footer: {
		padding: '0',
		width : '100%',
		color : props => props.fontColor,
	}
});

export default function MachineHistory() {
	const {colors} = require('../../values/colors.json');
	const {machines} = require('../../values/preferences.json')
	const current_section = getCurrentPage();
	const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isMount, setIsMount] = React.useState(true);
  const [ rows, setRows ] = React.useState([]);
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
	const {WordsTable} = require('../../values/strings.json');
	const classes = useStyles2({
		customTheme : colors.customTheme,
		colorOn : colors['buttonOn'],
		colorOff : colors['buttonOff'],
		neumOutShadow : colors.neumOutShadow,
		fontColor : colors.fontColor,
	})

	const refresh = useSelector(state => state.switches, (prev, next) => {
    return machines[current_section].every((machine) => {
			return prev[machine] === next[machine]
		})
	})

  const handleChangePage = (event, newPage) => {
		setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
  };

  const handleStatus = row => {
  		return row.status ? 'ON':'OFF'
	}

	const getLastSwitch =  () => {
  	axios.get('/api/get/switch/history', {
			params: {
				selects: ['machine', 'status', 'created', 'controlledBy'],
				section : current_section,
				num: 1
			}}).then(({data}) => {
					setRows(prevArray => {
						prevArray.splice(-1, 1)
						return [data[0], ...prevArray]
					});
			})
	}

	const getSwitchHistory = async  () => {
  	const {showHistoryNumber} = require('../../values/defaults.json');
  	await axios.get('/api/get/switch/history', {
			params: {
				selects: ['machine', 'status', 'created', 'controlledBy'],
				section : current_section,
				num: showHistoryNumber
			}}).then(({data}) => {
				setRows(data);
				setIsMount(false);
			})
	}

	const TableContent = () => {
			return (
				(rowsPerPage > 0 ? Array.from(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : Array.from(rows)).map(
					(row, index) => 
						<TableRow key={index}>
							<TableCell className={classes.text} align="center" component="th" scope="row">
								{WordsTable[row.machine]}
							</TableCell>
							<TableCell className={row.status !== 0 ? classes.statusOn: classes.statusOff} align="center">{handleStatus(row)}</TableCell>
							<TableCell className={classes.text} align="center">{row.controlledBy}</TableCell>
							<TableCell className={classes.text} align="center">{row.created}</TableCell>
						</TableRow>
					)
			)
	}

	const TableEmptyHandler = () => {
  	const defaultHeight = 53;
  	return (
  		<>
  		{
  			emptyRows > 0 && (
						<TableRow style={{ height: defaultHeight * emptyRows }}>
						  <TableCell colSpan={6} />
						</TableRow>
					  )
  		}
			</>
		)
	}

	const CustomTableFooter = () => {
  	return(
  		<TableRow>
				<TablePagination
					className={classes.footer}
					rowsPerPageOptions={[5]}
					colSpan={5}
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					SelectProps={{
					inputProps: { 'aria-label': 'rows per page' },
					native: true,
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
					ActionsComponent={TablePaginationActions}
				/>
			</TableRow>
		)
	}
	useEffect(() => {
		isMount || getLastSwitch()
	}, [refresh])

	useEffect(() => {
		getSwitchHistory();
		return () => {
			setIsMount(true);
		}
	}, []);

  return (
  	isMount ||
    <MuiThemeProvider theme={theme}>
		<TableContainer component={Paper} className={classes.container}>
			  <Table className={classes.table} aria-label="custom pagination table">
					<TableBody>
						<TableContent />
						<TableEmptyHandler/>
					</TableBody>
					<TableFooter>
						<CustomTableFooter />
					</TableFooter>
			  </Table>
			</TableContainer>
	  </MuiThemeProvider>
  );
}