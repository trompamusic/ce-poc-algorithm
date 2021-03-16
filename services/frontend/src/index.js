import 'core-js/fn/array/find';
import 'core-js/fn/object/values';
import 'core-js/fn/array/every';
import 'core-js/fn/set';
import 'core-js/fn/map';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
