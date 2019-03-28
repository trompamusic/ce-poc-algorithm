import gql from 'graphql-tag';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { providers } from '../../utils';
import ProcessStatusIcon from '../../components/ProcessStatusIcon';
import styles from './ControlActionDetails.styles';

class ControlActionDetails extends Component {
  static propTypes = {
    processId: PropTypes.string.isRequired,
  };

  state = {
    unsubscribe: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // query is loading
    if (nextProps.data.loading) {
      return null;
    }

    if (prevState.unsubscribe) {
      prevState.unsubscribe();
    }

    return {
      unsubscribe: nextProps.data.subscribeToMore({
        document : CONTROL_ACTION_SUBSCRIPTION,
        variables: {
          identifier: nextProps.processId,
        },
        updateQuery: previousResult => {
          // we use the updateQuery function to call the fetchMore function
          nextProps.data.fetchMore({
            updateQuery: (previousResult, { fetchMoreResult }) => fetchMoreResult || previousResult,
          });

          return previousResult;
        },
      }),
    };
  }

  renderPropertyValue = propertyValue => {
    const { classes } = this.props;

    return (
      <div className={classes.propertyValue} key={propertyValue.identifier}>
        <Typography><strong>title</strong>: {propertyValue.title}</Typography>
        <Typography><strong>value</strong>: {propertyValue.nodeValue ? propertyValue.nodeValue.source : propertyValue.value}</Typography>
      </div>
    );
  };

  render() {
    const {
      classes,
      processId,
      data: { loading, error, ControlAction },
    } = this.props;

    if (error && error.message) {
      return <Typography color="error">{error.message}</Typography>;
    }

    if (!processId || loading || !ControlAction || !ControlAction.length) {
      return null;
    }

    const action = ControlAction[0];

    return (
      <Paper className={classes.root}>
        <div className={classes.paragraph}>
          <Typography variant="body1"><strong>Status:</strong></Typography>
          <Typography variant="body2" className={classes.status}>
            <ProcessStatusIcon status={action.actionStatus} size={24} /> {action.actionStatus}
          </Typography>
        </div>
        <div className={classes.paragraph}>
          <Typography variant="body1"><strong>Description:</strong></Typography>
          <Typography variant="body2">{action.description || 'No description given'}</Typography>
        </div>
        {action.error ? (
          <div className={classes.paragraph}>
            <Typography variant="body1"><strong>Error:</strong></Typography>
            <Typography variant="body2" component="pre">{action.error}</Typography>
          </div>
        ) : null}
        <div className={classes.paragraph}>
          <Typography variant="body1"><strong>Target:</strong></Typography>
          <Typography variant="body2">{action.target && action.target.title}</Typography>
        </div>
        <div className={classes.paragraph}>
          <Typography variant="body1"><strong>Objects:</strong></Typography>
          {action.object && action.object.map(this.renderPropertyValue)}
        </div>
        <div className={classes.paragraph}>
          <Typography variant="body1"><strong>Result:</strong></Typography>
          {action.result ? (
            <React.Fragment>
              <Typography variant="body2"><strong>title</strong>: {action.result.title}</Typography>
              <Typography variant="body2"><strong>source</strong>: {action.result.source}</Typography>
            </React.Fragment>
          ) : <Typography variant="body2">No result</Typography>}
        </div>
      </Paper>
    );
  }
}

export const CONTROL_ACTION_QUERY = gql`
    query ($identifier: String!) {
        ControlAction(identifier: $identifier) {
            identifier
            description
            actionStatus
            error
            target {
                title
            }
            result {
                ... on DigitalDocument {
                    title
                    source
                }
            }
            object {
                ... on PropertyValue {
                    identifier
                    title
                    value
                    nodeValue {
                        ... on DigitalDocument {
                            title
                            source
                        }
                        __typename
                    }
                }
            }
            __typename
        }
    }
`;

export const CONTROL_ACTION_SUBSCRIPTION = gql`
    subscription ($identifier: String!) {
        ControlActionMutation(identifier: $identifier) {
            identifier
        }
    }
`;

export default providers(
  ControlActionDetails,
  withStyles(styles),
  graphql(CONTROL_ACTION_QUERY, {
    options: props => ({
      variables: {
        identifier: props.processId,
      },
    }),
  }),
);
