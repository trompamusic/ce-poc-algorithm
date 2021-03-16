import React from 'react';
import ReactDOM from 'react-dom';
import { baseProvided } from '../../testUtils';
import PotentialActionObjects from './PotentialActionObjects';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(baseProvided(<PotentialActionObjects />), div);
});
