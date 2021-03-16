import React from 'react';
import ReactDOM from 'react-dom';
import { baseProvided } from '../../testUtils';
import PropertyField from './PropertyField';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(baseProvided(<PropertyField />), div);
});
