import React from 'react';
import { storiesOf } from '@storybook/react';
import ResourceSelectDialog from './ResourceSelectDialog';

storiesOf('ResourceSelectDialog', module)
  .add('basic', () => <ResourceSelectDialog />);
