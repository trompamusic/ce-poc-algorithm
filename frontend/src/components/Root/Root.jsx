import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Route, Switch, withRouter } from 'react-router-dom';
import Home from '../../screens/Home';
import Process from '../../screens/Process';
import NotFound from '../../screens/NotFound';
import styles from './Root.styles';

export class Root extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    if (this.props.error) {
      return <div>Something wen't terribly wrong!</div>;
    }

    return (
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/process/:id" component={Process} exact />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default withRouter(withStyles(styles)(Root));
