import React from 'react';
import ReactDOM from 'react-dom';
import { baseProvided } from '../../testUtils';
import ProcessStatusIcon from './ProcessStatusIcon';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(baseProvided(<ProcessStatusIcon />), div);
});
