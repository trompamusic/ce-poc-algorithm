import React from 'react';
import { storiesOf } from '@storybook/react';
import PropertyValueSpecificationField from './PropertyValueSpecificationField';

storiesOf('PropertyValueSpecificationField', module)
  .add('basic', () => <PropertyValueSpecificationField />);
