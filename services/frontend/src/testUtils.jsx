import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import 'url-search-params-polyfill';
import client from './graphql/index';
import theme from './theme';

export const provided = node => (
  <ApolloProvider client={client}>
    <JssProvider>
      <MuiThemeProvider theme={theme}>
        <Router>
          {node}
        </Router>
      </MuiThemeProvider>
    </JssProvider>
  </ApolloProvider>
);
