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

  title: string | (() => string);
  message: string | (() => string);
  content: C | null;

  buttons: {
    text: string | (() => string);
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }[];

  defaultResult?: R;
  value?: string; // only needed for input dialog // TODO? - this is not very nice
  mapResult?: (data: Record<string, string>) => R;
};

// --- functions -----------------------------------------------------

abstract class AbstractDialogsCtrl<C, A = {}> {
  #showDialog: <R = void>(config: DialogConfig<C, R>) => Promise<R>;
  #translate: (key: string) => string;

  constructor(params: {
    translate: (key: string) => string;
    showDialog: <R = void>(config: DialogConfig<C, R>) => Promise<R>;
  }) {
    this.#translate = params.translate;
    this.#showDialog = params.showDialog;
  }

  info(params: {
    message: string | (() => string);
    content?: C;
    title?: string | (() => string);
    okText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'info',
      title: params.title || this.#translate('information'),
      message: params.message || '',
      content: params.content || null,

      buttons: [
        {
          variant: 'primary',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  success(params: {
    message: string | (() => string);
    content?: C;
    title?: string | (() => string);
    okText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'success',
      title: params.title || this.#translate('success'),
      message: params.message || '',
      content: params.content || null,

      buttons: [
        {
          variant: 'success',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  warn(params: {
    message: string | (() => string);
    content?: C;
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog({
      type: 'warning',
      title: params.title || this.#translate('warning'),
      message: params.message || '',
      content: params.content || null,

      buttons: [
        {
          variant: 'warning',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  error(params: {
    message: string | (() => string);
    content?: C;
    title?: string | (() => string);
    okText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'error',
      title: params.title || this.#translate('error'),
      message: params.message || '',
      content: params.content || null,

      buttons: [
        {
          variant: 'danger',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  confirm(params: {
    message: string | (() => string);
    content?: C;
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'confirmation',
      title: params.title || this.#translate('confirmation'),
      message: params.message || '',
      content: params.content || null,
      mapResult: ({ button }) => button === '1',

      buttons: [
        {
          text: params.cancelText || this.#translate('cancel')
        },
        {
          variant: 'primary',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  approve(params: {
    message: string | (() => string);
    content?: C;
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'approval',
      title: params.title || this.#translate('approval'),
      message: params.message || '',
      content: params.content || null,
      mapResult: ({ button }) => button === '1',

      buttons: [
        {
          text: params.cancelText || this.#translate('cancel')
        },
        {
          variant: 'danger',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  prompt(params: {
    message: string | (() => string);
    content?: C;
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
    value?: string;
  }) {
    return this.#showDialog({
      type: 'prompt',
      title: params.title || this.#translate('input'),
      message: params.message || '',
      content: params.content || null,
      value: params.value || '',
      mapResult: ({ button, input }) => (button === '0' ? null : input),

      buttons: [
        {
          text: params.cancelText || this.#translate('cancel')
        },
        {
          variant: 'primary',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  input(
    params: {
      message?: string | (() => string);
      content?: C;
      title?: string | (() => string);
      okText?: string | (() => string);
      cancelText?: string | (() => string);
    } & A
  ) {
    return this.#showDialog({
      type: 'input',
      title: params.title || this.#translate('input'),
      message: params.message || '',
      content: params.content || null,
      mapResult: ({ button, input }) => (button === '0' ? null : input),

      buttons: [
        {
          text: params.cancelText || this.#translate('cancel')
        },
        {
          variant: 'primary',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }
}
