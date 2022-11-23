// === exports =======================================================

export { AbstractToastsController };
export type { ToastConfig };

// === local types ===================================================

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastParams<C> = {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C;
  duration?: number;
  closable?: boolean;
};

type ToastConfig<C> = {
  type: ToastType;
} & ToastParams<C>;

// === exported classes ==============================================

abstract class AbstractToastsController<C> {
  #showToast: (config: ToastConfig<C>) => void;

  constructor(params: { showToast: (config: ToastConfig<C>) => void }) {
    this.#showToast = params.showToast;
  }

  info(params: ToastParams<C>) {
    return this.#showToast({
      type: 'info',
      ...params
    });
  }

  success(params: ToastParams<C>) {
    return this.#showToast({
      type: 'success',
      ...params
    });
  }

  warn(params: ToastParams<C>) {
    return this.#showToast({
      type: 'warning',
      ...params
    });
  }

  error(params: ToastParams<C>) {
    return this.#showToast({
      type: 'error',
      ...params
    });
  }
}
