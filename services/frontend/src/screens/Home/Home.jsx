import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';
import Breadcrumb from '../../components/Breadcrumb';
import Hero from '../../components/Hero/Hero';
import AddAsyncProcessButton from '../../containers/CreateControlActionButton/CreateControlActionButton';
import AsyncProcessTable from '../../containers/ControlActionList/ControlActionList';
import { providers, setPrerenderReady } from '../../utils';
import styles from './Home.styles';

export class Home extends Component {
  componentDidMount() {
    setPrerenderReady(true);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <title>Pilot POC</title>
        </Helmet>
        <Hero />
        <div className={classes.content}>
          <Breadcrumb />
          <AsyncProcessTable />
        </div>
        <AddAsyncProcessButton />
      </React.Fragment>
    );
  }
}

export default providers(
  Home,
  withStyles(styles),
);
