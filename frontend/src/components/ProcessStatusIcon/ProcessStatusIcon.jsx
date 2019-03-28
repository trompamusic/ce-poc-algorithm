import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import styles from './ProcessStatusIcon.styles';

class ProcessStatusIcon extends Component {
  static propTypes = {
    status: PropTypes.string,
    size  : PropTypes.number,
  };

  static defaultProps = {
    size: 24,
  };

  render() {
    const { status, size } = this.props;

    switch(status) {
    case 'complete':
      return <DoneIcon style={{ color: 'green', fontSize: size }} />;
    case 'error':
      return <ErrorIcon style={{ color: 'red', fontSize: size }} />;
    case 'stopping':
      return <StopIcon style={{ color: 'gray', fontSize: size }} />;
    case 'starting':
    case 'running':
      return <CircularProgress style={{ color: 'orange' }} size={size} />;
    case 'requested':
    case 'accepted':
    default:
      return <PauseIcon style={{ color: 'gray', fontSize: size }} />;
    }
  }
}

export default withStyles(styles)(ProcessStatusIcon);
