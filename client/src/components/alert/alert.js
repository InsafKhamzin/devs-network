import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import AlertUi from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        position: "absolute"
    },
}));


const Alert = ({ alerts }) => {
    const classes = useStyles();

    if (alerts !== null && alerts.length > 0) {

        return (
            <div className={classes.root}>
                {
                    alerts.map(alert => (
                        <AlertUi key={alert.id} severity={alert.alertType}>
                            {alert.msg}
                        </AlertUi>))
                }
            </div>);
    }
    return null;
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
