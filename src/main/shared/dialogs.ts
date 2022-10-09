// === exports =======================================================

export { createDialogFunctions };
export type { DialogConfig };

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
  content?: HTMLElement | null;
  mapResult?: (data: Record<string, string>) => R;
};

// --- functions -----------------------------------------------------

function createDialogFunction<C, P extends Record<string, any>, R = void>(
  logic: (base: C, params: P) => Promise<R>
): {
  (base: C, params: P): Promise<R>;
} {
  return (base, params) => logic(base, params);
}

function createDialogFunctions<C>(
  showDialog: <R = void>(
    base: C,
    init: (translate: (key: string) => string) => DialogConfig<R>
  ) => Promise<R>
) {
  return {
    showInfoDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
      }
    >((base, params) => {
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
    }),

    showSuccessDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
      }
    >((base, params) => {
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
    }),

    showWarnDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
      }
    >((base, params) => {
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
    }),

    showErrorDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
      }
    >((base, params) => {
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
    }),

    showConfirmDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
        cancelText?: string;
      },
      boolean
    >((base, params) => {
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
    }),

    showApproveDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
        cancelText?: string;
      },
      boolean
    >((base, params) => {
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
    }),

    showInputDialog: createDialogFunction<
      C,
      {
        message: string;
        title?: string;
        okText?: string;
        cancelText?: string;
        value?: string;
      },
      string | null
    >((base, params) => {
      const inputField = document.createElement('sl-input');
      inputField.name = 'input';
      inputField.value = params.value || '';
      inputField.size = 'small';
      inputField.setAttribute('autofocus', '');

      return showDialog(base, (translate) => ({
        type: 'input',
        title: params.title || translate('input'),
        message: params.message || '',
        content: inputField,
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
    })
  };
}
