import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { providers } from '../../utils';
import styles from './ResourceSelectDialog.styles';

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
  };

  handleResultClick = (event, details) => {
    this.setState({
      selected: { ...details },
    });
  };

  handleSelectClick = event => {
    const { selected } = this.state;

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(event, selected);
    }
  };

  renderResult = result => {
    const { classes }  = this.props;
    const { selected } = this.state;

    return (
      <article
        className={classNames(classes.result, {
          [classes.resultSelected]: selected && selected.identifier === result.identifier,
        })}
        onClick={event => this.handleResultClick(event, result)}
        key={result.identifier}
      >
        <Typography variant="h6" color="primary">
          {result.title}
        </Typography>
        <Typography variant="subtitle1">
          {result.__typename} by {result.contributor}
        </Typography>
        <Typography>
          {result.description}
        </Typography>
      </article>
    );
  };

  render() {
    const { classes, search, open, onClose } = this.props;

    const results = (search && search.DigitalDocument) || [];

    return (
      <Dialog
        PaperProps={{
          className: classes.paper,
        }}
        onClose={onClose}
        open={open}
      >
        <header className={classes.header}>
          <div className={classes.inputWrapper}>
            <InputBase className={classes.inputBase} placeholder="Enter search term" fullWidth disabled />
            <div className={classes.inputAdornment}>
              <IconButton color="primary">
                <SearchIcon />
              </IconButton>
            </div>
          </div>
          <Typography>{results.length} results</Typography>
        </header>
        <DialogContent className={classes.content}>
          <section>
            {results.map(this.renderResult)}
          </section>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!this.state.selected}
            onClick={this.handleSelectClick}
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const SEARCH_METADATA_QUERY = gql`
    query {
        DigitalDocument {
            __typename
            identifier
            title
            description
            contributor
            thumbnailUrl
        }
    }
`;

export default providers(
  ResourceSelectDialog,
  graphql(SEARCH_METADATA_QUERY, {
    name: 'search',
  }),
  withStyles(styles),
);
