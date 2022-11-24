import { VNode } from 'preact';

import {
  ToastConfig as GenericToastConfig,
  ToastsController as GenericToastController
} from './shared/toasts/abstract-toasts-controller';

// types
export type ToastConfig = GenericToastConfig<VNode>;
export type ToastsController = GenericToastController<VNode>;
export type { ToastType } from './shared/toasts/abstract-toasts-controller';

// hooks
export { useDialogs } from './shoelace-widgets-preact/use-dialogs';
export { useToasts } from './shoelace-widgets-preact/use-toasts';
