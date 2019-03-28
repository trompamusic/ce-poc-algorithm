import fs from 'fs';
import path from 'path';
import http from 'https';
import { spawn } from 'child_process';
import { execute, makePromise } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws';
import Promise from 'bluebird';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';

const GRAPHQL_WEBSOCKET_URL = process.env.GRAPHQL_WEBSOCKET_URL || 'ws://api-test.trompamusic.eu';
const ENTRY_POINT_IDENTIFIER = process.env.ENTRY_POINT_IDENTIFIER;

const TMP_PATH = path.resolve(__dirname, '../tmp');

if (!ENTRY_POINT_IDENTIFIER) {
  console.log('ENTRY_POINT_IDENTIFIER is missing from the environment variables.');

  process.exit(1);
}

const websocketClient = new SubscriptionClient(GRAPHQL_WEBSOCKET_URL, { reconnect: true }, ws);
const link = new WebSocketLink(websocketClient);

/**
 * Debug function which only logs information when the NODE_ENV is not production.
 */
const debug = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

websocketClient.on('connected', () => debug('connected to WebSocket'));
websocketClient.on('disconnected', () => debug('disconnected from WebSocket'));
websocketClient.on('reconnecting', () => debug('trying to reconnect to WebSocket'));
websocketClient.on('reconnected', () => debug('reconnected to WebSocket'));
websocketClient.on('error', (error) => debug('error from WebSocket', error.message));

const CONTROL_ACTION_SUBSCRIPTION = gql`
    subscription {
        ControlActionRequest(entryPointIdentifier: "${process.env.ENTRY_POINT_IDENTIFIER}") {
            identifier
        }
    }
`;

const CONTROL_ACTION_QUERY = gql`
    query ($identifier: String!) {
        ControlAction(identifier: $identifier) {
            actionStatus
            identifier
            object {
                ... on PropertyValue {
                    value
                    name
                    nodeValue {
                        ... on DigitalDocument {
                            format
                            source
                        }
                    }
                }
            }
        }
    }
`;

const CONTROL_ACTION_MUTATION = gql`
    mutation ($identifier: ID!, $status: ControlActionStatus!, $error: String) {
        UpdateControlAction (
            identifier: $identifier,
            actionStatus: $status,
            error: $error
        ) {
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

const CREATE_DIGITAL_DOCUMENT_MUTATION = gql`
    mutation($source: String!, $name: String!) {
        CreateDigitalDocument(
            contributor: "https://videodock.com",
            creator: "Algorithm POC",
            description: "Result of the Verovio algorithm POC",
            format: "mei",
            language: en,
            source: $source,
            subject: "Verovio, XML to MEI",
            title: $name,
            name: $name
        ) {
            identifier
            title
            source
        }
    }
`;

const ADD_DIGITAL_DOCUMENT_TO_CONTROL_ACTION_MUTATION = gql`
    mutation ($controlActionIdentifier: String!, $digitalDocumentIdentifier: String!) {
        AddActionInterfaceThingInterface (
            from: {identifier: $controlActionIdentifier, type: ControlAction}
            to: {identifier: $digitalDocumentIdentifier, type: DigitalDocument}
            field: result
        ) {
            from {
                __typename
            }
            to {
                __typename
            }
        }
    }
`;

/**
 * Run a GraphQL query and return the results
 *
 * @param {Object} query
 * @param {Object} [variables]
 * @returns {Promise}
 */
async function query(query, variables) {
  return makePromise(execute(link, {
    query,
    variables,
  })).then((response) => {
    debug('GraphQL response:', response);

    return response.data;
  });
}

/**
 * Helper function which sends a mutation query to the CE GraphQL API.
 *
 * @param {string} identifier
 * @param {string} status
 * @param {string} [error]
 * @returns {Promise}
 */
async function mutateControlAction(identifier, status, error) {
  return query(CONTROL_ACTION_MUTATION, {
    status,
    identifier,
    error,
  });
}

/**
 * Helper function to create a DigitalDocument with predefined properties.
 *
 * @param {string} source
 * @param {string} name
 * @returns {Promise}
 */
async function createDigitalDocument(source, name) {
  return query(CREATE_DIGITAL_DOCUMENT_MUTATION, {
    source,
    name
  });
}

/**
 * Add DigitalDocument result to ControlAction
 *
 * @param {string} controlActionIdentifier
 * @param {string} digitalDocumentIdentifier
 * @returns {Promise}
 */
async function addResultToControlAction(controlActionIdentifier, digitalDocumentIdentifier) {
  return query(ADD_DIGITAL_DOCUMENT_TO_CONTROL_ACTION_MUTATION, {
    controlActionIdentifier,
    digitalDocumentIdentifier,
  });
}

/**
 * Download a XML file from an URL and store it locally.
 *
 * @param {string} url The XML URL.
 * @returns {Promise}
 */
async function downloadXmlFromURL(url) {
  return new Promise((resolve) => {
    const filename = Date.now();
    const outputFile = path.resolve(TMP_PATH, `${filename}-${path.basename(url)}`);
    const file = fs.createWriteStream(outputFile);

    debug(`Downloading XML from URL: ${url} to file: ${outputFile}`);

    http.get(url, function (response) {
      response.pipe(file);

      file.on('finish', () => {
        debug('Finished downloading XML file');
        file.close();
      });

      file.on('close', () => {
        resolve(outputFile);
      });
    });
  });
}

/**
 * The function which transforms a MusicXML file to a MEI file using the Verovio binary.
 *
 * @param {Object} digitalDocument The DigitalDocument object.
 * @returns {Promise}
 */
async function transformMusicXMLToMei(digitalDocument) {
  // download the XML first.
  const xmlFile = await downloadXmlFromURL(digitalDocument.source);

  // determine the name of the MEI file
  const meiFile = xmlFile.replace(/\.xml$/, '.mei');

  // return a Promise.
  return new Promise((resolve, reject) => {
    const process = spawn('verovio', ['-a', '-f', 'xml', '-t', 'mei', '-o', meiFile, xmlFile]);

    let errorOutput = '';

    // capture process stderr data into a variable.
    process.stderr.on('data', data => {
      debug(`Verovio stderr: ${data}`);
      errorOutput += data;
    });

    // the process has caused an error
    process.on('error', error => {
      reject(error.message);
    });

    // finished running the command.
    process.on('close', code => {
      debug(`Verovio finished with code: ${code}`);

      return code === 0 ? resolve(meiFile) : reject(errorOutput);
    });
  }).finally(() => {
    // we always want to remove the downloaded file!
    try {
      fs.unlinkSync(xmlFile);
      fs.unlinkSync(meiFile);
    } catch (error) {
      // expected
    }
  });
}

/**
 * Query and return the found ControlAction by identifier.
 *
 * @param {string} identifier The ControlAction identifier.
 * @returns {Promise}
 */
async function getControlActionByIdentifier(identifier) {
  const run = execute(link, { query: CONTROL_ACTION_QUERY, variables: { identifier } });

  return makePromise(run).then(({ data }) => {
    if (!data.ControlAction[0]) {
      return Promise.reject(`Failed to query ControlAction with identifier: ${identifier}`);
    }

    return data.ControlAction[0];
  });
}

/**
 * Validate and return the ControlAction object values in a List.
 *
 * @param {Object} controlAction
 * @returns {Promise}
 */
async function getControlActionObjectValues(controlAction) {
  const digitalDocumentPropertyValue = controlAction.object.find(({ name }) => name === 'MusicXML File');
  const resultNamePropertyValue = controlAction.object.find(({ name }) => name === 'resultName');

  const digitalDocument = digitalDocumentPropertyValue && digitalDocumentPropertyValue.nodeValue;
  const resultName = resultNamePropertyValue && resultNamePropertyValue.value;

  // the resultName is required for this algorithm.
  if (!resultName) {
    return Promise.reject('The resultName is not given or empty!');
  }

  // the DigitalDocument object is required for this algorithm.
  if (!digitalDocument) {
    return Promise.reject('The MusicXML file object is not given');
  }

  // the DigitalDocument must have a source.
  if (!digitalDocument.source) {
    return Promise.reject('The MusicXML file needs a source property');
  }

  // the algorithm can only process XML files.
  if (digitalDocument.format !== 'xml') {
    return Promise.reject('The MusicXML file must have a XML format');
  }

  // resolve with the digitalDocument and resultName properties.
  return Promise.resolve({
    digitalDocument,
    resultName,
  });
}

/**
 * This function gets called when we receive a mutation from the CE GraphQL API
 *
 * @param {string} identifier The ControlAction identifier which has been mutated.
 * @returns {Promise}
 */
async function handleSubscriptionUpdate(identifier) {
  // get the ControlAction.
  const controlAction = await getControlActionByIdentifier(identifier);

  // get and validate the ControlAction object values.
  const { digitalDocument, resultName } = await getControlActionObjectValues(controlAction);

  // we are going to run the algorithm on this ControlAction so we can set the actionStatus to `running`.
  await mutateControlAction(identifier, 'running');

  // run the algorithm!
  const meiFile = await transformMusicXMLToMei(digitalDocument);

  // the result of this algorithm is a new DigitalDocument.
  const { CreateDigitalDocument } = await createDigitalDocument(meiFile, resultName);

  // link the newly created DigitalDocument to the ControlAction.
  await addResultToControlAction(identifier, CreateDigitalDocument.identifier);

  // everything looks good, set the ControlAction actionStatus to complete.
  await mutateControlAction(identifier, 'complete');
}

// subscribe to updates
execute(link, { query: CONTROL_ACTION_SUBSCRIPTION }).subscribe(({ data }) => {
  debug('incoming mutation:', data);

  const identifier = data.ControlActionRequest.identifier;

  handleSubscriptionUpdate(identifier).catch((error) => {
    // this catches all rejections or errors while preparing or running the algorithm.
    debug('Error caught while running algorithm:', error);

    // update the actionStatus and error property of the ControlAction
    return mutateControlAction(identifier, 'error', error);
  });
});
