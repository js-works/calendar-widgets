// === exports =======================================================

export { AbstractDialogsCtrl };
export type { DialogConfig };

// === types =========================================================

type DialogConfig<C, R> = {
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'confirmation'
    | 'approval'
    | 'prompt'
    | 'input';

  title: string;
  message: string;
  content: C | null;

  buttons: {
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }[];

  defaultResult?: R;
  value?: string; // only needed for input dialog // TODO? - this is not very nice
  mapResult?: (data: Record<string, string>) => R;
};

// --- functions -----------------------------------------------------

abstract class AbstractDialogsCtrl<C> {
  #showDialog: <R = void>(
    init: (translate: (key: string) => string) => DialogConfig<C, R>
  ) => Promise<R>;

  constructor(
    showDialog: <R = void>(
      fn: (translate: (key: string) => string) => DialogConfig<C, R>
    ) => Promise<R>
  ) {
    this.#showDialog = showDialog;
  }

  info(params: {
    message: string; //
    content?: C;
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'info',
      title: params.title || translate('information'),
      message: params.message || '',
      content: params.content || null,

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
    content?: C;
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'success',
      title: params.title || translate('success'),
      message: params.message || '',
      content: params.content || null,

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
    content?: C;
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'warning',
      title: params.title || translate('warning'),
      message: params.message || '',
      content: params.content || null,

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
    content?: C;
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'error',
      title: params.title || translate('error'),
      message: params.message || '',
      content: params.content || null,

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
    content?: C;
    title?: string;
    okText?: string;
    cancelText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'confirmation',
      title: params.title || translate('confirmation'),
      message: params.message || '',
      content: params.content || null,
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
    content?: C; //
    title?: string;
    okText?: string;
    cancelText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'approval',
      title: params.title || translate('approval'),
      message: params.message || '',
      content: params.content || null,
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

  prompt(params: {
    message: string;
    content?: C;
    title?: string;
    okText?: string;
    cancelText?: string;
    value?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'prompt',
      title: params.title || translate('input'),
      message: params.message || '',
      content: params.content || null,
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

  input(params: {
    message?: string;
    content?: C;
    title?: string;
    okText?: string;
    cancelText?: string;
  }) {
    return this.#showDialog((translate) => ({
      type: 'input',
      title: params.title || translate('input'),
      message: params.message || '',
      content: params.content || null,
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
