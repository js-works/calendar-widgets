// === exports =======================================================

export { AbstractToastsController };
export type { ToastConfig, ToastsController, ToastType };

// === exported types ================================================

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastConfig<C> = ToastParams<C> & {
  type: ToastType;
};

type ToastsController<C> = {
  info(config: ToastParams<C>): void;
  success(config: ToastParams<C>): void;
  warn(config: ToastParams<C>): void;
  error(config: ToastParams<C>): void;
  show(config: ToastConfig<C>): void;
};

// === local types ===================================================

type ToastParams<C> = {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C;
  duration?: number;
  closable?: boolean;
};

// === exported classes ==============================================

abstract class AbstractToastsController<C> implements ToastsController<C> {
  readonly #showToast: (config: ToastConfig<C>) => void;

  constructor(params: { showToast: (config: ToastConfig<C>) => void }) {
    this.#showToast = params.showToast;
  }

  info(params: ToastParams<C>) {
    this.#showToast({ type: 'info', ...params });
  }

  success(params: ToastParams<C>) {
    this.#showToast({ type: 'success', ...params });
  }

  warn(params: ToastParams<C>) {
    this.#showToast({ type: 'warning', ...params });
  }

  error(params: ToastParams<C>) {
    this.#showToast({ type: 'error', ...params });
  }

  show(config: ToastConfig<C>) {
    this.#showToast(config);
  }
}
