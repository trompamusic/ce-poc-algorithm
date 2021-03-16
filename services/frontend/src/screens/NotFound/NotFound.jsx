import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { providers, setPrerenderReady } from '../../utils';
import styles from './NotFound.styles';

export class NotFound extends Component {
  componentDidMount() {
    setPrerenderReady(true);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Helmet>
          <title>Not found</title>
          <meta name="prerender-status-code" content="404" />
        </Helmet>
        <div className={classes.root}>
          <div>
            <Typography variant="h4" align="center" paragraph gutterBottom>
              The requested page doesn't exist!
            </Typography>
          </div>
          <div className={classes.buttonRow}>
            <Button
              className={classes.button}
              color="primary"
              component={Link}
              children="Go to the homepage instead"
              to="/"
              variant="contained"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default providers(
  NotFound,
  withStyles(styles),
);
