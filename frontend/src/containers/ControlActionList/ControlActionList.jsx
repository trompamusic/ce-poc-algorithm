import Paper from '@material-ui/core/Paper';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import ProcessStatusIcon from '../../components/ProcessStatusIcon/ProcessStatusIcon';
import { providers } from '../../utils';
import styles from './ControlActionList.styles';

class ControlActionList extends Component {
  handleTableRowClick = (event, id) => {
    this.props.history.push(`/process/${id}`);
  };

  render() {
    const { classes, data: { ControlAction } } = this.props;

    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Id</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Target</TableCell>
              <TableCell align="right">Action status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ControlAction && ControlAction.map(row => (
              <TableRow
                className={classes.tableRow}
                key={row.identifier}
                onClick={event => this.handleTableRowClick(event, row.identifier)}
                hover
              >
                <TableCell component="th" scope="row">{row.identifier}</TableCell>
                <TableCell component="th" scope="row">{row.description}</TableCell>
                <TableCell component="th" scope="row">{row.target && row.target.title}</TableCell>
                <TableCell align="right"><ProcessStatusIcon status={row.actionStatus} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export const CONTROL_ACTIONS_QUERY = gql`
    query {
        ControlAction {
            identifier
            description
            name
            actionStatus
            target {
                identifier
                title
            }
            object {
                ... on MetadataInterface {
                    identifier
                }
            }
        }
    }
`;

export default providers(
  ControlActionList,
  graphql(CONTROL_ACTIONS_QUERY),
  withStyles(styles),
  withRouter,
);
