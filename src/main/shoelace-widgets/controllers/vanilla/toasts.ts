// === exports =======================================================

export { AbstractToastsController };
export type { ToastConfig };

// === local types ===================================================

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastParams<C, E extends Record<string, any> = {}> = {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C;
  duration?: number;
} & E;

type ToastConfig<C, E extends Record<string, unknown> = {}> = {
  type: ToastType;
} & ToastParams<C, E>;

// === exported classes ==============================================

abstract class AbstractToastsController<
  C,
  E extends Record<string, unknown> = {}
> {
  #showToast: (config: ToastConfig<C, E>) => void;

  constructor(params: { showToast: (config: ToastConfig<C, E>) => void }) {
    this.#showToast = params.showToast;
  }

  info(params: ToastParams<C, E>) {
    return this.#showToast({
      type: 'info',
      ...params
    });
  }

  success(params: ToastParams<C, E>) {
    return this.#showToast({
      type: 'success',
      ...params
    });
  }

  warn(params: ToastParams<C, E>) {
    return this.#showToast({
      type: 'warning',
      ...params
    });
  }

  error(params: ToastParams<C, E>) {
    return this.#showToast({
      type: 'error',
      ...params
    });
  }
}
