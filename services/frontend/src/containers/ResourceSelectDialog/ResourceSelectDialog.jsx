import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MultiModalComponent, { SearchConfig, searchTypes } from 'trompa-multimodal-component';
import { providers } from '../../utils';
import styles from './ResourceSelectDialog.styles';

const REACT_APP_GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL || 'https://api-test.trompamusic.eu';

class ResourceSelectDialog extends Component {
  static propTypes = {
    open    : PropTypes.bool,
    types   : PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onClose : PropTypes.func,
  };

  static defaultProps = {
    open : false,
    types: null,
  };

  state = {
    selected: null,
    config  : new SearchConfig({
      searchTypes: [searchTypes.DigitalDocument],
      fixedFilter: { format_in: ['application/musicxml', 'application/musicxml+zip'] },
    }),
  };

  render() {
    const { classes, open, onClose } = this.props;

    return (
      <Dialog
        PaperProps={{
          className: classes.paper,
        }}
        onClose={onClose}
        keepMounted={false}
        open={open}
      >
        <MultiModalComponent
          config={this.state.config}
          uri={REACT_APP_GRAPHQL_URL}
          onResultClick={node => this.props.onSelect(null, node)}
        />
      </Dialog>
    );
  }
}

export default providers(
  ResourceSelectDialog,
  withStyles(styles),
);
