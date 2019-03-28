import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import PotentialActionObjects from '../../components/PotentialActionObjects/PotentialActionObjects';
import { providers } from '../../utils';
import styles from './CreateControlActionForm.styles';

const ENTRY_POINT_IDENTIFIER = process.env.REACT_APP_ENTRY_POINT_IDENTIFIER;

class CreateControlActionForm extends Component {
  static propTypes = {
    open   : PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    action: '',
    values: {},
  };

  handleActionChange = event => {
    this.setState({ action: event.target.value, values: {} });
  };

  handlePotentialActionChange = values => {
    this.setState({ values });
  };

  handleSubmit = event => {
    const { query: { EntryPoint } } = this.props;
    const { values, action }        = this.state;

    const entryPoint      = EntryPoint && EntryPoint[0];
    const potentialAction = entryPoint && entryPoint.potentialAction.find(({ identifier }) => identifier === action);

    event.preventDefault();

    if (!potentialAction) {
      this.setState({ error: 'Potential action doesn\'t exist' });

      return;
    }

    this.setState({ error: null });

    const propertyObject = potentialAction.object
      .filter(({ __typename, identifier }) => __typename === 'Property' && values[identifier])
      .map(({ identifier }) => ({
        potentialActionPropertyIdentifier: identifier,
        nodeIdentifier                   : values[identifier].identifier,
        nodeType                         : values[identifier].__typename,
      }));

    const propertyValueObject = potentialAction.object
      .filter(({ __typename, identifier }) => __typename === 'PropertyValueSpecification' && values[identifier])
      .map(({ identifier, valuePattern }) => ({
        potentialActionPropertyValueSpecificationIdentifier: identifier,
        value                                              : values[identifier],
        valuePattern,
      }));

    this.props.mutate({
      variables: {
        entryPointIdentifier     : ENTRY_POINT_IDENTIFIER,
        potentialActionIdentifier: action,
        propertyObject,
        propertyValueObject,
      },
    }).then(({ data: { RequestControlAction } }) => {
      // navigate to detail page
      this.props.history.push(`/process/${RequestControlAction.identifier}`);
    });
  };

  renderEntryPoint = () => {
    const { query: { error, loading, EntryPoint } } = this.props;

    if (loading) {
      return <CircularProgress />;
    }

    const entryPoint = EntryPoint && EntryPoint[0];

    if (!entryPoint) {
      if (error) {
        return <Typography color="error">{error.message}</Typography>;
      }

      return null;
    }

    return (
      <React.Fragment>
        <TextField
          margin="normal"
          label="Entry Point"
          value={entryPoint.title}
          disabled
          fullWidth
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="entry-point">Choose Action</InputLabel>
          <Select
            value={this.state.action}
            onChange={this.handleActionChange}
            inputProps={{
              name: 'action',
              id  : 'action',
            }}
          >
            <MenuItem value="">
              <em>Select action</em>
            </MenuItem>
            {entryPoint.potentialAction.map(({ identifier, name }) => (
              <MenuItem value={identifier} key={identifier}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </React.Fragment>
    );
  };

  renderPotentialAction() {
    const { query: { EntryPoint } } = this.props;
    const { action }                = this.state;

    const entryPoint      = EntryPoint && EntryPoint[0];
    const potentialAction = entryPoint && entryPoint.potentialAction.find(({ identifier }) => identifier === action);

    return (
      <PotentialActionObjects
        key={action}
        potentialAction={potentialAction}
        onChange={this.handlePotentialActionChange}
      />
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog maxWidth="md" onClose={this.props.onClose} open={this.props.open}>
        <form
          className={classes.container}
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <DialogTitle>Add new action</DialogTitle>
          <DialogContent style={{ width: 400 }}>
            {this.renderEntryPoint()}
            {this.renderPotentialAction()}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button type="submit" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export const ENTRY_POINT_QUERY = gql`
    query($identifier: String) {
        EntryPoint(identifier: $identifier) {
            identifier
            title
            description
            contentType
            subject
            potentialAction {
                __typename
                ... on ControlAction {
                    identifier
                    name
                    object {
                        __typename
                        ... on Property {
                            identifier
                            title
                            description
                            rangeIncludes
                        }
                        ... on PropertyValueSpecification {
                            identifier
                            title
                            valueName
                            valueRequired
                            valuePattern
                            description
                            defaultValue
                            minValue
                            maxValue
                            stepValue
                        }
                    }
                }
            }
        }
    }
`;

export const CREATE_CONTROL_ACTION = gql`
    mutation (
    $entryPointIdentifier: String!,
    $potentialActionIdentifier: String!,
    $propertyObject: [_PropertyInput],
    $propertyValueObject: [_PropertyValueInput]

    ) {
        RequestControlAction (
            controlAction: {
                entryPointIdentifier: $entryPointIdentifier
                potentialActionIdentifier: $potentialActionIdentifier
                propertyObject: $propertyObject
                propertyValueObject: $propertyValueObject
            }
        ) {
            identifier
        }
    }
`;

export default providers(
  CreateControlActionForm,
  graphql(ENTRY_POINT_QUERY, {
    name   : 'query',
    options: {
      variables: {
        identifier: ENTRY_POINT_IDENTIFIER,
      },
    },
  }),
  graphql(CREATE_CONTROL_ACTION, {
    name: 'mutate',
  }),
  withStyles(styles),
  withRouter,
);
