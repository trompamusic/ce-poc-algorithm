import React from 'react';
import ReactDOM from 'react-dom';
import { baseProvided } from '../../testUtils';
import PropertyValueSpecificationField from './PropertyValueSpecificationField';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(baseProvided(<PropertyValueSpecificationField />), div);
});
