import React from 'react';
import ReactDOM from 'react-dom';
import { baseProvided } from '../../testUtils';
import Hero from './Hero';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(baseProvided(<Hero />), div);
});
