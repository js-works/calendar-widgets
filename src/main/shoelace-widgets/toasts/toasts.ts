// === exports =======================================================

export { AbstractToastsController };
export type { ToastConfig, ToastType };

// === local types ===================================================

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastConfig<C> = {
  title?: string | (() => string);
  message?: string | (() => string);
  content?: C;
  duration?: number;
  closable?: boolean;
};

// === exported classes ==============================================

abstract class AbstractToastsController<C> {
  readonly show: (type: ToastType, params: ToastConfig<C>) => void;

  constructor(params: {
    showToast: (type: ToastType, params: ToastConfig<C>) => void;
  }) {
    this.show = params.showToast;
  }

  info(params: ToastConfig<C>) {
    return this.show('info', params);
  }

  success(params: ToastConfig<C>) {
    return this.show('success', params);
  }

  warn(params: ToastConfig<C>) {
    return this.show('warning', params);
  }

  error(params: ToastConfig<C>) {
    return this.show('error', params);
  }
}
