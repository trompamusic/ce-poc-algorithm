import TextField from '@material-ui/core/TextField';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './PropertyValueSpecificationField.styles';

/**
 * Dynamically render an input based on the `disambiguatingDescription`
 */
class PropertyValueSpecificationField extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  state = {
    valid: true,
  };

  handleChange = event => {
    const { field, onChange } = this.props;
    const { value }           = event.currentTarget;

    // for now only validate required
    if (field.valueRequired && !value) {
      this.setState({ valid: false });
    } else if (!this.state.valid) {
      this.setState({ valid: true });
    }

    // proxy onChange event
    onChange(field, value);
  };

  renderNumberField() {
    const { field, value } = this.props;

    return (
      <TextField
        type="number"
        name={field.valueName}
        label={field.title}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        helperText={field.description}
        inputProps={{
          min : field.minValue,
          max : field.maxValue,
          step: field.stepValue,
        }}
        required={field.valueRequired}
        error={!this.state.valid}
        fullWidth
      />
    );
  }

  renderTextField() {
    const { field, value } = this.props;

    return (
      <TextField
        name={field.valueName}
        label={field.title}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        helperText={field.description}
        required={field.valueRequired}
        error={!this.state.valid}
        fullWidth
      />
    );
  }

  render() {
    const { field } = this.props;

    switch (field.disambiguatingDescription) {
    case 'Int':
    case 'Float':
      return this.renderNumberField();
    case 'String':
    case 'URL':
    case 'Duration':
    default:
      return this.renderTextField();
    }
  }
}

export default withStyles(styles)(PropertyValueSpecificationField);
