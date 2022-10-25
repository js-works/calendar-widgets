// === exports =======================================================

export { AbstractDialogsController };
export type { DialogConfig, TranslationKey };

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
  width: string | null;

  buttons: {
    text: string | (() => string);
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }[];

  params: Record<string, any>; // TODO - mak this type safe
  defaultResult?: R;
  mapResult?: (data: Record<string, string>) => R;
};

type TranslationKey =
  | 'ok'
  | 'cancel'
  | 'information'
  | 'success'
  | 'warning'
  | 'error'
  | 'confirmation'
  | 'approval'
  | 'input';

// --- functions -----------------------------------------------------

abstract class AbstractDialogsController<C, A = {}> {
  #showDialog: <R = void>(config: DialogConfig<C, R>) => Promise<R>;
  #translate: (key: TranslationKey) => string;

  constructor(params: {
    translate: (key: TranslationKey) => string;
    showDialog: <R = void>(config: DialogConfig<C, R>) => Promise<R>;
  }) {
    this.#translate = params.translate;
    this.#showDialog = params.showDialog;
  }

  info(params: {
    message: string | (() => string);
    content?: C;
    width?: string;
    title?: string | (() => string);
    okText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'info',
      params,
      title: params.title || this.#translate('information'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,

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
    width?: string;
    title?: string | (() => string);
    okText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'success',
      params,
      title: params.title || this.#translate('success'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,

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
    width?: string;
    title?: string;
    okText?: string;
  }) {
    return this.#showDialog({
      type: 'warning',
      params,
      title: params.title || this.#translate('warning'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,

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
    width?: string;
    title?: string | (() => string);
    okText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'error',
      params,
      title: params.title || this.#translate('error'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,

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
    width?: string;
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'confirmation',
      params,
      title: params.title || this.#translate('confirmation'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,
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
    width?: string;
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'approval',
      params,
      title: params.title || this.#translate('approval'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,
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
    width?: string;
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
    value?: string;
  }) {
    return this.#showDialog({
      type: 'prompt',
      params,
      title: params.title || this.#translate('input'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,

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
      width?: string;
      title?: string | (() => string);
      okText?: string | (() => string);
      cancelText?: string | (() => string);
    } & A
  ) {
    return this.#showDialog({
      type: 'input',
      params,
      title: params.title || this.#translate('input'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,
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
