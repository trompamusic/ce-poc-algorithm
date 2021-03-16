import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Hero from '../../components/Hero/Hero';
import AsyncProcessDetails from '../../containers/ControlActionDetails/ControlActionDetails';
import { providers } from '../../utils';
import styles from './Process.styles';

export class Process extends Component {
  render() {
    const { classes } = this.props;
    const processId   = this.props.match.params.id;

    return (
      <div>
        <Helmet>
          <title>Process screen</title>
          <meta name="description" content="Process screen description" />
          <meta property="og:title" content="Process" />
        </Helmet>
        <Hero />
        <div className={classes.content}>
          <Breadcrumb paths={[{ label: `Process ${processId}` }]} />
          <AsyncProcessDetails processId={processId} />
        </div>
      </div>
    );
  }
}

export default providers(
  Process,
  withStyles(styles),
);
