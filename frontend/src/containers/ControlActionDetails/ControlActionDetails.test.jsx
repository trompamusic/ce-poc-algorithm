import React from 'react';
import ReactDOM from 'react-dom';
import { provided } from '../../testUtils';
import ControlActionDetails from './ControlActionDetails';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(provided(<ControlActionDetails />), div);
});
