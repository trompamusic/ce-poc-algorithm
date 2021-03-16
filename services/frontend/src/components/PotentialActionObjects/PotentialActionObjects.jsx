import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PropertyField from '../PropertyField';
import PropertyValueSpecificationField from '../PropertyValueSpecificationField';
import styles from './PotentialActionObjects.styles';

/**
 * This Component renders all PotentialAction objects in fields.
 */
class PotentialActionObjects extends Component {
  static propTypes = {
    potentialAction: PropTypes.object,
    onChange       : PropTypes.func,
  };

  state = {};

  constructor(props) {
    super(props);

    if (props.potentialAction) {
      for(let i = 0; i < props.potentialAction.object.length; i++) {
        const current = props.potentialAction.object[i];

        this.state[current.identifier] = typeof current.defaultValue !== 'undefined' ? current.defaultValue : '';
      }

      props.onChange(this.state);
    }
  }

  handleFieldChange = (field, value) => {
    this.setState({ [field.identifier]: value }, () => {
      this.props.onChange(this.state);
    });
  };

  renderField = field => {
    const fieldProps = {
      value   : this.state[field.valueName],
      onChange: this.handleFieldChange,
      key     : field.identifier,
      field,
    };

    if (field.__typename === 'Property') {
      return <PropertyField {...fieldProps} />;
    }

    return <PropertyValueSpecificationField {...fieldProps} />;
  };

  render() {
    const { potentialAction } = this.props;

    if (!potentialAction) {
      return null;
    }

    return potentialAction.object.map(this.renderField);
  }
}

export default withStyles(styles)(PotentialActionObjects);
