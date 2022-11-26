// === exports =======================================================

export { AbstractDialogsController };

export type {
  DialogConfig,
  DialogType,
  ToastConfig,
  ToastOptions,
  ToastType,
  ShowDialogFunction,
  ShowToastFunction
};

// === types =========================================================

type DialogType =
  | 'info'
  | 'success'
  | 'warn'
  | 'error'
  | 'confirm'
  | 'approve'
  | 'prompt'
  | 'input';

interface DialogBaseOptions<C> {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C | null;
  width?: string | null;
  maxWidth?: string | null;
  height?: string | null;
  maxHeight?: string | null;
  padding?: string | null;
}

interface InfoDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
}

interface SuccessDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
}

interface WarnDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
}

interface ErrorDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
}

interface ConfirmDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
}

interface ApproveDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
}

interface PromptDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
  value?: string | null;
}

interface InputDialogOptions<C> extends DialogBaseOptions<C> {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
  labelLayout?: 'auto' | 'vertical' | 'horizontal' | null;
}

interface InfoDialogConfig<C> extends InfoDialogOptions<C> {
  type: 'info';
}

interface SuccessDialogConfig<C> extends SuccessDialogOptions<C> {
  type: 'success';
}

interface WarnDialogConfig<C> extends WarnDialogOptions<C> {
  type: 'warn';
}

interface ErrorDialogConfig<C> extends ErrorDialogOptions<C> {
  type: 'error';
}

interface ConfirmDialogConfig<C> extends ConfirmDialogOptions<C> {
  type: 'confirm';
}

interface ApproveDialogConfig<C> extends ApproveDialogOptions<C> {
  type: 'approve';
}

interface PromptDialogConfig<C> extends PromptDialogOptions<C> {
  type: 'prompt';
}

interface InputDialogConfig<C> extends InputDialogOptions<C> {
  type: 'input';
}

type DialogConfig<C = unknown> =
  | InfoDialogConfig<C>
  | SuccessDialogConfig<C>
  | WarnDialogConfig<C>
  | ErrorDialogConfig<C>
  | ConfirmDialogConfig<C>
  | ApproveDialogConfig<C>
  | PromptDialogConfig<C>
  | InputDialogConfig<C>;

abstract class DialogControllerBase<C> {
  abstract show(type: 'info', options: InfoDialogOptions<C>): Promise<void>;

  abstract show(
    type: 'success',
    options: SuccessDialogOptions<C>
  ): Promise<void>;

  abstract show(type: 'warn', options: WarnDialogOptions<C>): Promise<void>;
  abstract show(type: 'error', options: ErrorDialogOptions<C>): Promise<void>;

  abstract show(
    type: 'confirm',
    options: ConfirmDialogOptions<C>
  ): Promise<boolean>;

  abstract show(
    type: 'approve',
    options: ApproveDialogOptions<C>
  ): Promise<boolean>;

  abstract show(
    type: 'prompt',
    options: PromptDialogOptions<C>
  ): Promise<string | null>;

  abstract show(
    type: 'input',
    options: InputDialogOptions<C>
  ): Promise<Record<string, any> | null>;
}

type ShowDialogFunction<C> = DialogControllerBase<C>['show'];

type ToastType = 'info' | 'success' | 'warn' | 'error';

interface ToastOptions<C> {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C | null;
  duration?: number;
}

interface ToastConfig<C> extends ToastOptions<C> {
  type: ToastType;
}

interface ShowToastFunction<C> {
  (type: ToastType, options: ToastOptions<C>): void;
}

abstract class AbstractDialogsController<C> extends DialogControllerBase<C> {
  #showDialog: ShowDialogFunction<C>;
  #showToast: ShowToastFunction<C>;

  constructor(options: {
    showDialog: ShowDialogFunction<C>;
    showToast: ShowToastFunction<C>;
  }) {
    super();
    this.#showDialog = options.showDialog;
    this.#showToast = options.showToast;
  }

  show(type: 'info', options: InfoDialogOptions<C>): Promise<void>;
  show(type: 'success', options: SuccessDialogOptions<C>): Promise<void>;
  show(type: 'warn', options: WarnDialogOptions<C>): Promise<void>;
  show(type: 'error', options: ErrorDialogOptions<C>): Promise<void>;
  show(type: 'confirm', options: ConfirmDialogOptions<C>): Promise<boolean>;
  show(type: 'approve', options: ApproveDialogOptions<C>): Promise<boolean>;
  show(type: 'prompt', options: PromptDialogOptions<C>): Promise<string | null>;

  show(
    type: 'input',
    options: InputDialogOptions<C>
  ): Promise<Record<string, any> | null>;

  show(type: unknown, options: unknown): Promise<unknown> {
    return this.#showDialog(type as any, options as any);
  }

  toast(type: ToastType, options: ToastOptions<C>): void {
    this.#showToast(type, options);
  }
}
