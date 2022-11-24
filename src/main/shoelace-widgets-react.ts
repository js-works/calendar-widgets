import React, { ReactNode } from 'react';
import { createComponent } from '@lit-labs/react';

import {
  ToastConfig as GenericToastConfig,
  ToastsController as GenericToastController
} from './shared/toasts/abstract-toasts-controller';

import { Fieldset as SxFieldset } from './shoelace-widgets/components/fieldset/fieldset';
import { TextField as SxTextField } from './shoelace-widgets/components/text-field/text-field';

// types
export type ToastConfig = GenericToastConfig<ReactNode>;
export type ToastsController = GenericToastController<ReactNode>;
export type { ToastType } from './shared/toasts/abstract-toasts-controller';

// hooks
export { useDialogs } from './shoelace-widgets-react/use-dialogs';
export { useToasts } from './shoelace-widgets-react/use-toasts';

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
