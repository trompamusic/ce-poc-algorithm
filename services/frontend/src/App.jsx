import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import theme from './theme';
import client from './graphql';
import Root from './components/Root';

const createClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix       : 'c',
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const forceRefresh = !('pushState' in window.history);

    return (
      <ApolloProvider client={client}>
        <JssProvider generateClassName={createClassName}>
          <MuiThemeProvider theme={theme}>
            <BrowserRouter forceRefresh={forceRefresh}>
              <Root error={this.state.error} />
            </BrowserRouter>
          </MuiThemeProvider>
        </JssProvider>
      </ApolloProvider>
    );
  }
}

export default App;
