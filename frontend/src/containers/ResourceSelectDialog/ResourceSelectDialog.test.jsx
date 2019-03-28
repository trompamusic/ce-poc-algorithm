import React from 'react';
import ReactDOM from 'react-dom';
import { provided } from '../../testUtils';
import ResourceSelectDialog from './ResourceSelectDialog';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(provided(<ResourceSelectDialog />), div);
});
