import React from 'react';
import ReactDOM from 'react-dom';
import { baseProvided } from '../../testUtils';
import Breadcrumb from './Breadcrumb';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(baseProvided(<Breadcrumb />), div);
});
