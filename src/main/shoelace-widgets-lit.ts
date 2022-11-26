import { TemplateResult } from 'lit';
import { ToastType, ToastConfig } from 'shoelace-widgets/internal';

// classes
export { DialogsController } from './shoelace-widgets-lit/dialogs-controller';
export { ToastsController } from './shoelace-widgets-lit/toasts-controller';

// types
type LitToastConfig = ToastConfig<TemplateResult>;

export type { LitToastConfig as ToastConfig, ToastType };
