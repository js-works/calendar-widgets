// === exports =======================================================

export { AbstractDialogsController };
export type { DialogConfig, DialogType, ShowDialogFunction };

// === types =========================================================

type DialogType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'confirmation'
  | 'approval'
  | 'prompt'
  | 'input';

type DialogBaseConfig<T extends DialogType, C> = {
  type: T;
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C | null;
  width?: string | null;
  maxWidth?: string | null;
  height?: string | null;
  maxHeight?: string | null;
  padding?: string | null;
};

type InfoDialogConfig<C> = DialogBaseConfig<'info', C> & {
  okText?: string | (() => string) | null;
};

type SuccessDialogConfig<C> = DialogBaseConfig<'success', C> & {
  okText?: string | (() => string) | null;
};

type WarningDialogConfig<C> = DialogBaseConfig<'warning', C> & {
  okText?: string | (() => string) | null;
};

type ErrorDialogConfig<C> = DialogBaseConfig<'error', C> & {
  okText?: string | (() => string) | null;
};

type ConfirmationDialogConfig<C> = DialogBaseConfig<'confirmation', C> & {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
};

type ApprovalDialogConfig<C> = DialogBaseConfig<'approval', C> & {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
};

type PromptDialogConfig<C> = DialogBaseConfig<'prompt', C> & {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
  value?: string | null;
};

type InputDialogConfig<C> = DialogBaseConfig<'input', C> & {
  okText?: string | (() => string) | null;
  cancelText?: string | (() => string) | null;
  labelLayout?: 'auto' | 'vertical' | 'horizontal' | null;
};

type DialogConfig<C = unknown> =
  | InfoDialogConfig<C>
  | SuccessDialogConfig<C>
  | WarningDialogConfig<C>
  | ErrorDialogConfig<C>
  | ConfirmationDialogConfig<C>
  | ApprovalDialogConfig<C>
  | PromptDialogConfig<C>
  | InputDialogConfig<C>;

type ShowDialogFunction<C> = {
  (config: InfoDialogConfig<C>): Promise<void>;
  (config: SuccessDialogConfig<C>): Promise<void>;
  (config: WarningDialogConfig<C>): Promise<void>;
  (config: ErrorDialogConfig<C>): Promise<void>;
  (config: ConfirmationDialogConfig<C>): Promise<boolean>;
  (config: ApprovalDialogConfig<C>): Promise<boolean>;
  (config: PromptDialogConfig<C>): Promise<string | null>;
  (config: InputDialogConfig<C>): Promise<Record<string, any> | null>;
};

type InfoDialogParams<C> = Omit<InfoDialogConfig<C>, 'type'>;
type SuccessDialogParams<C> = Omit<SuccessDialogConfig<C>, 'type'>;
type WarningDialogParams<C> = Omit<WarningDialogConfig<C>, 'type'>;
type ErrorDialogParams<C> = Omit<ErrorDialogConfig<C>, 'type'>;
type ConfirmationDialogParams<C> = Omit<ConfirmationDialogConfig<C>, 'type'>;
type ApprovalDialogParams<C> = Omit<ApprovalDialogConfig<C>, 'type'>;
type PromptDialogParams<C> = Omit<PromptDialogConfig<C>, 'type'>;
type InputDialogParams<C> = Omit<InputDialogConfig<C>, 'type'>;

abstract class AbstractDialogsController<C> {
  #showDialog: ShowDialogFunction<C>;

  constructor(params: {
    showDialog: <R>(config: DialogConfig<C>) => Promise<R>;
  }) {
    this.#showDialog = params.showDialog;
  }

  info(params: InfoDialogParams<C>): Promise<void> {
    return this.#showDialog({ type: 'info', ...params });
  }

  success(params: SuccessDialogParams<C>): Promise<void> {
    return this.#showDialog({ type: 'success', ...params });
  }

  warn(params: WarningDialogParams<C>): Promise<void> {
    return this.#showDialog({ type: 'warning', ...params });
  }

  error(params: ErrorDialogParams<C>): Promise<void> {
    return this.#showDialog({ type: 'error', ...params });
  }

  confirm(params: ConfirmationDialogParams<C>): Promise<boolean> {
    return this.#showDialog({ type: 'confirmation', ...params });
  }

  approve(params: ApprovalDialogParams<C>): Promise<boolean> {
    return this.#showDialog({ type: 'approval', ...params });
  }

  prompt(params: PromptDialogParams<C>): Promise<string | null> {
    return this.#showDialog({ type: 'prompt', ...params });
  }

  input(params: InputDialogParams<C>): Promise<Record<string, any> | null> {
    return this.#showDialog({ type: 'input', ...params });
  }
}
