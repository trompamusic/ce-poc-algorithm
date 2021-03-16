import React from 'react';
import { storiesOf } from '@storybook/react';
import PropertyField from './PropertyField';

storiesOf('PropertyField', module)
  .add('basic', () => <PropertyField />);
