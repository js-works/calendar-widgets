import React from 'react';
import { createComponent } from '@lit-labs/react';
import { Fieldset as SxFieldset } from './shoelace-widgets/components/fieldset/fieldset';
import { TextField as SxTextField } from './shoelace-widgets/components/text-field/text-field';

export { useDialogs } from './shoelace-widgets-react/use-dialogs';

export const Fieldset = createComponent({
  elementClass: SxFieldset,
  tagName: 'sx-fieldset',
  displayName: 'Fieldset',
  react: React
});

export const TextField = createComponent({
  elementClass: SxTextField,
  tagName: 'sx-text-field',
  displayName: 'TextField',
  react: React
});
