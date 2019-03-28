import React from 'react';
import ReactDOM from 'react-dom';
import { provided } from '../../testUtils';
import CreateControlActionForm from './CreateControlActionForm';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(provided(<CreateControlActionForm />), div);
});
