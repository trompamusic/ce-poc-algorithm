import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import images from '../../theme/images';
import styles from './Hero.styles';

class Hero extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <img className={classes.logo} src={images.logo} width="400" alt="logo" />
        </div>
        <div>
          <Typography variant="h4" color="inherit">
            Digital Score Edition Component
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Hero);
