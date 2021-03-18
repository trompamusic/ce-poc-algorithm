import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import styles from './Breadcrumb.styles';

class Breadcrumb extends Component {
  static propTypes = {
    paths: PropTypes.array,
  };

  static defaultProps = {
    paths: [],
  };

  renderPath = path => {
    if (!path.href || this.props.location.pathname === path.href) {
      return path.label;
    }

    return (
      <Link component={RouterLink} to={path.href} key={path.href}>
        {path.label}
      </Link>
    );
  };

  render() {
    const { classes, paths } = this.props;

    const allPaths = [{
      href : '/',
      label: 'Home',
    }, ...paths];

    return (
      <div className={classes.root}>
        <Typography>
          {allPaths
            .map(this.renderPath)
            .reduce((prev, curr) => [prev, ' / ', curr])
          }
        </Typography>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Breadcrumb));
