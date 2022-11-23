import { VNode } from 'preact';

import {
  ToastConfig as GenericToastConfig,
  ToastType
} from './shared/toasts/toasts';

// hooks
export { useDialogs } from './shoelace-widgets-preact/use-dialogs';
export { useToasts } from './shoelace-widgets-preact/use-toasts';

// types
export type ToastConfig = GenericToastConfig<VNode>;
export type { ToastType };
