import React from 'react';
import ReactDOM from 'react-dom';
import { provided } from '../../testUtils';
import ControlActionList from './ControlActionList';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(provided(<ControlActionList />), div);
});
