// === exports =======================================================

export { AbstractToastsController };
export type { ToastConfig, ToastsController, ToastType };

// === exported types ================================================

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastConfig<C> = {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C;
  duration?: number;
  closable?: boolean;
};

type ToastsController<C> = {
  info(config: ToastConfig<C>): void;
  success(config: ToastConfig<C>): void;
  warn(config: ToastConfig<C>): void;
  error(config: ToastConfig<C>): void;
  show(type: ToastType, config: ToastConfig<C>): void;
};

// === exported classes ==============================================

abstract class AbstractToastsController<C> implements ToastsController<C> {
  readonly #showToast: (type: ToastType, config: ToastConfig<C>) => void;

  constructor(params: {
    showToast: (type: ToastType, config: ToastConfig<C>) => void;
  }) {
    this.#showToast = params.showToast;
  }

  info(config: ToastConfig<C>) {
    this.#showToast('info', config);
  }

  success(config: ToastConfig<C>) {
    this.#showToast('success', config);
  }

  warn(config: ToastConfig<C>) {
    this.#showToast('warning', config);
  }

  error(config: ToastConfig<C>) {
    this.#showToast('error', config);
  }

  show(type: ToastType, config: ToastConfig<C>) {
    this.#showToast(type, config);
  }
}
