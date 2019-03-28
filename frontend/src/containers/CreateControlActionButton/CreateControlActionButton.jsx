import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';
import { providers } from '../../utils';
import CreateControlActionForm from '../CreateControlActionForm/CreateControlActionForm';
import styles from './CreateControlActionButton.styles';

/**
 * The CreateControlActionButton component renders a Material Design floating action button. When this button gets
 * pressed, the CreateControlActionFrom dialog will be opened.
 */
class CreateControlActionButton extends Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Fab
          className={classes.root}
          color="primary"
          onClick={this.handleClick}
        >
          <AddIcon />
        </Fab>
        <CreateControlActionForm
          open={this.state.open}
          onClose={this.handleClose}
        />
      </React.Fragment>
    );
  }
}

export default providers(
  CreateControlActionButton,
  withStyles(styles),
  withRouter,
);
