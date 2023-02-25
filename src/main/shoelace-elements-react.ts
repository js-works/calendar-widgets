import React from 'react';
import { createComponent } from '@lit-labs/react';
import { Fieldset as SxFieldset } from './shoelace-elements/components/fieldset/fieldset';
import { TextField as SxTextField } from './shoelace-elements/components/text-field/text-field';

// types
export type { DialogType, ToastType } from './shoelace-elements-internal';

// hooks
export { useDialogs } from './shoelace-elements-react/use-dialogs';

// components
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
