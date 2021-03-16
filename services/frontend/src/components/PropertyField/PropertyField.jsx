import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ResourceSelectDialog from '../../containers/ResourceSelectDialog/ResourceSelectDialog';
import styles from './PropertyField.styles';

/**
 * The PropertyField allows you to search and select an existing resource in the CE
 */
class PropertyField extends Component {
  static propTypes = {
    field   : PropTypes.object.isRequired,
    onChange: PropTypes.func,
  };

  state = {
    resourceSelectDialogOpen: false,
    valid                   : true,
    value                   : null,
  };

  handleSearchClick = () => {
    this.setState({ resourceSelectDialogOpen: true });
  };

  handleResourceSelectDialogSelect = (event, resource) => {
    this.setState({
      resourceSelectDialogOpen: false,
      value                   : resource,
    });

    // proxy onChange event
    this.props.onChange(this.props.field, resource);
  };

  handleResourceSelectDialogClose = () => {
    this.setState({ resourceSelectDialogOpen: false });
  };

  render() {
    const { field } = this.props;
    const { value } = this.state;

    return (
      <React.Fragment>
        <TextField
          name={field.valueName}
          label={field.title}
          value={value ? value.title : ''}
          margin="normal"
          helperText={field.description}
          error={!this.state.valid}
          onClick={this.handleSearchClick}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          readOnly
          required
        />
        <ResourceSelectDialog
          onSelect={this.handleResourceSelectDialogSelect}
          onClose={this.handleResourceSelectDialogClose}
          open={this.state.resourceSelectDialogOpen}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PropertyField);
