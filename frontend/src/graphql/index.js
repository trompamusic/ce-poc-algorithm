import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import introspectionQueryResultData from './fragmentTypes.json';

const uri = process.env.REACT_APP_GRAPHQL_URL;

const httpLink = new HttpLink({
  uri,
  credentials: 'same-origin',
});

const wsLink = new WebSocketLink({
  uri    : uri.replace(/https?/, 'ws'),
  options: {
    reconnect: true,
    lazy     : true,
  },
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,),);
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    ApolloLink.split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);

        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink,
    ),
  ]),
  cache: new InMemoryCache({
    resultCaching: false,
    fragmentMatcher,
  }),
});

export default client;
