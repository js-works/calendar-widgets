// === exports =======================================================

export { createDialogsApi, AbstractDialogCtrl, AbstractDialogsCtrl };
export type { DialogConfig, DialogsApi };

// === types =========================================================

type DialogConfig<R> = {
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'confirmation'
    | 'approval'
    | 'input';

  title: string;
  message: string;

  buttons: {
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }[];

  defaultResult?: R;
  value?: string; // only needed for input dialog // TODO? - this is not very nice
  mapResult?: (data: Record<string, string>) => R;
};

type DialogsApi = ReturnType<typeof createDialogsApi>;

type Params<K extends keyof DialogsApi> = DialogsApi[K] extends (
  params: infer P
) => unknown
  ? P
  : never;

// --- functions -----------------------------------------------------

abstract class AbstractDialogsCtrl {
  #showDialog: <R = void>(
    init: (translate: (key: string) => string) => DialogConfig<R>
  ) => Promise<R>;

  constructor(
    showDialog: <R = void>(
      fn: (translate: (key: string) => string) => DialogConfig<R>
    ) => Promise<R>
  ) {
    this.#showDialog = showDialog;
  }

  info(params: {
    message: string; //
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'info',
      title: params.title || translate('information'),
      message: params.message || '',

      buttons: [
        {
          variant: 'primary',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }

  success(params: {
    message: string; //
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'success',
      title: params.title || translate('success'),
      message: params.message || '',

      buttons: [
        {
          variant: 'success',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }

  warn(params: {
    message: string; //
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'warning',
      title: params.title || translate('warning'),
      message: params.message || '',

      buttons: [
        {
          variant: 'warning',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }

  error(params: {
    message: string; //
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'error',
      title: params.title || translate('error'),
      message: params.message || '',

      buttons: [
        {
          variant: 'danger',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }

  confirm(params: {
    message: string; //
    title?: string;
    okText?: string;
    cancelText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'confirmation',
      title: params.title || translate('confirmation'),
      message: params.message || '',
      mapResult: ({ button }) => button === '1',

      buttons: [
        {
          text: params.cancelText || translate('cancel')
        },
        {
          variant: 'primary',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }

  approve(params: {
    message: string; //
    title?: string;
    okText?: string;
    cancelText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'approval',
      title: params.title || translate('approval'),
      message: params.message || '',
      mapResult: ({ button }) => button === '1',

      buttons: [
        {
          text: params.cancelText || translate('cancel')
        },
        {
          variant: 'danger',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }

  input(params: {
    message: string;
    title?: string;
    okText?: string;
    cancelText?: string;
    value?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'input',
      title: params.title || translate('input'),
      message: params.message || '',
      value: params.value || '',
      mapResult: ({ button, input }) => (button === '0' ? null : input),

      buttons: [
        {
          text: params.cancelText || translate('cancel')
        },
        {
          variant: 'primary',
          text: params.okText || translate('ok')
        }
      ]
    }));
  }
}

function createDialogsApi<B>(
  base: B,
  showDialog: <B, R = void>(
    base: B,
    fn: (translate: (key: string) => string) => DialogConfig<R>
  ) => Promise<R>
) {
  return {
    info: (params: {
      message: string; //
      title?: string;
      okText?: string;
    }) => {
      return showDialog(base, (translate) => ({
        type: 'info',
        title: params.title || translate('information'),
        message: params.message || '',

        buttons: [
          {
            variant: 'primary',
            text: params.okText || translate('ok')
          }
        ]
      }));
    },

    success: (params: {
      message: string; //
      title?: string;
      okText?: string;
    }) => {
      return showDialog(base, (translate) => ({
        type: 'success',
        title: params.title || translate('success'),
        message: params.message || '',

        buttons: [
          {
            variant: 'success',
            text: params.okText || translate('ok')
          }
        ]
      }));
    },

    warn: (params: {
      message: string; //
      title?: string;
      okText?: string;
    }) => {
      return showDialog(base, (translate) => ({
        type: 'warning',
        title: params.title || translate('warning'),
        message: params.message || '',

        buttons: [
          {
            variant: 'warning',
            text: params.okText || translate('ok')
          }
        ]
      }));
    },

    error(params: {
      message: string; //
      title?: string;
      okText?: string;
    }) {
      return showDialog(base, (translate) => ({
        type: 'error',
        title: params.title || translate('error'),
        message: params.message || '',

        buttons: [
          {
            variant: 'danger',
            text: params.okText || translate('ok')
          }
        ]
      }));
    },

    confirm: (params: {
      message: string; //
      title?: string;
      okText?: string;
      cancelText?: string;
    }) => {
      return showDialog(base, (translate) => ({
        type: 'confirmation',
        title: params.title || translate('confirmation'),
        message: params.message || '',
        mapResult: ({ button }) => button === '1',

        buttons: [
          {
            text: params.cancelText || translate('cancel')
          },
          {
            variant: 'primary',
            text: params.okText || translate('ok')
          }
        ]
      }));
    },

    approve: (params: {
      message: string; //
      title?: string;
      okText?: string;
      cancelText?: string;
    }) => {
      return showDialog(base, (translate) => ({
        type: 'approval',
        title: params.title || translate('approval'),
        message: params.message || '',
        mapResult: ({ button }) => button === '1',

        buttons: [
          {
            text: params.cancelText || translate('cancel')
          },
          {
            variant: 'danger',
            text: params.okText || translate('ok')
          }
        ]
      }));
    },

    input: (params: {
      message: string;
      title?: string;
      okText?: string;
      cancelText?: string;
      value?: string;
    }) => {
      return showDialog(base, (translate) => ({
        type: 'input',
        title: params.title || translate('input'),
        message: params.message || '',
        value: params.value || '',
        mapResult: ({ button, input }) => (button === '0' ? null : input),

        buttons: [
          {
            text: params.cancelText || translate('cancel')
          },
          {
            variant: 'primary',
            text: params.okText || translate('ok')
          }
        ]
      }));
    }
  };
}

class AbstractDialogCtrl implements DialogsApi {
  readonly #getTarget: () => HTMLElement;
  readonly #query: string;

  constructor(parent: HTMLElement | (() => HTMLElement), query: string) {
    this.#getTarget = typeof parent === 'function' ? parent : () => parent;
    this.#query = query;
  }

  info(params: Params<'info'>) {
    return this.#getDialogsApi().info(params);
  }

  success(params: Params<'success'>) {
    return this.#getDialogsApi().success(params);
  }

  warn(params: Params<'warn'>) {
    return this.#getDialogsApi().warn(params);
  }

  error(params: Params<'error'>) {
    return this.#getDialogsApi().error(params);
  }

  confirm(params: Params<'confirm'>) {
    return this.#getDialogsApi().confirm(params);
  }

  approve(params: Params<'approve'>) {
    return this.#getDialogsApi().approve(params);
  }

  input(params: Params<'input'>) {
    return this.#getDialogsApi().input(params);
  }

  #getDialogsApi(): DialogsApi {
    const elem = this.#getTarget();

    if (elem.matches(this.#query) && 'api' in elem) {
      return (elem as unknown as { api: DialogsApi }).api;
    }

    const root = elem.shadowRoot || elem;
    const dialogsElem = root.querySelector(this.#query);

    return (dialogsElem as any).api;
  }
}
