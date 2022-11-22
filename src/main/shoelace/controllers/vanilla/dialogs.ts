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
  height: string | null;
  padding: string | null;

  buttons: {
    action: string;
    text: string | (() => string);
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }[];

  params: Record<string, any>; // TODO - mak this type safe
  defaultResult?: R;
  mapResult?: (action: string, data: Record<string, string>) => R;
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

abstract class AbstractDialogsController<C> {
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,

      buttons: [
        {
          action: 'value',
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,

      buttons: [
        {
          action: 'ok',
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,

      buttons: [
        {
          action: 'ok',
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,

      buttons: [
        {
          action: 'ok',
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,
      mapResult: (action) => action === 'ok',

      buttons: [
        {
          action: 'cancel',
          text: params.cancelText || this.#translate('cancel')
        },
        {
          action: 'ok',
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,
      mapResult: (action) => action === 'ok',

      buttons: [
        {
          action: 'cancel',
          text: params.cancelText || this.#translate('cancel')
        },
        {
          action: 'ok',
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
    height?: string;
    padding?: string;
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
      height: params.height ?? null,
      padding: params.padding ?? null,

      mapResult: (action, { input }) => (action === 'cancel' ? null : input),

      buttons: [
        {
          action: 'cancel',
          text: params.cancelText || this.#translate('cancel')
        },
        {
          action: 'ok',
          variant: 'primary',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }

  input(params: {
    message?: string | (() => string);
    content?: C;
    width?: string;
    height?: string;
    padding?: string;
    labelLayout?: 'auto' | 'vertical' | 'horizontal';
    title?: string | (() => string);
    okText?: string | (() => string);
    cancelText?: string | (() => string);
  }) {
    return this.#showDialog({
      type: 'input',
      params,
      title: params.title || this.#translate('input'),
      message: params.message || '',
      content: params.content || null,
      width: params.width ?? null,
      height: params.height ?? null,
      padding: params.padding ?? null,
      mapResult: (action, { input }) => (action === 'ok' ? null : input),

      buttons: [
        {
          action: 'cancel',
          text: params.cancelText || this.#translate('cancel')
        },
        {
          action: 'ok',
          variant: 'primary',
          text: params.okText || this.#translate('ok')
        }
      ]
    });
  }
}
