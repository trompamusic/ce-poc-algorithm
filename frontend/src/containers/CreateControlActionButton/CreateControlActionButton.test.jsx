import React from 'react';
import ReactDOM from 'react-dom';
import { provided } from '../../testUtils';
import CreateControlActionButton from './CreateControlActionButton';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(provided(<CreateControlActionButton />), div);
});
