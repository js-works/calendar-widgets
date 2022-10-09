import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { getDirection, getLanguage, translate } from '../i18n/i18n';

// icons
import infoIcon from '../icons/info-circle.icon';
import successIcon from '../icons/info-circle.icon';
import warningIcon from '../icons/exclamation-circle.icon';
import errorIcon from '../icons/exclamation-triangle.icon';
import confirmationIcon from '../icons/question-circle.icon';
import approvalIcon from '../icons/question-diamond.icon';
import inputIcon from '../icons/keyboard.icon';

// styles
import dialogsStyles from './dialogs.styles';

// === exports =======================================================

export {
  showApproveDialog,
  showConfirmDialog,
  showErrorDialog,
  showInfoDialog,
  showInputDialog,
  showSuccessDialog,
  showWarnDialog
};

// === types =========================================================

type DialogConfig<T> = {
  type: 'default' | 'success' | 'warning' | 'danger';
  icon: string;
  title: string;
  message: string;

  buttons: {
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }[];

  defaultResult?: T;
  content?: HTMLElement | null;
  mapResult?: (data: Record<string, string>) => T;
};

// --- functions -----------------------------------------------------

function createDialogFunction<P extends Record<string, any>, R = void>(
  logic: (parent: HTMLElement, params: P) => Promise<R>
): {
  (parent: HTMLElement, params: P): Promise<R>;
} {
  return (parent, params) => logic(parent, params);
}

function createDialogFunctions(
  showDialog: <T = void>(
    parent: HTMLElement,
    init: (translate: (key: string) => string) => DialogConfig<T>
  ) => Promise<T>
) {
  return {
    showInfoDialog: createDialogFunction<{
      message: string;
      title?: string;
      okText?: string;
    }>((parent, params) => {
      return showDialog(parent, (translate) => ({
        type: 'default',
        icon: infoIcon,
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

    showSuccessDialog: createDialogFunction<{
      message: string;
      title?: string;
      okText?: string;
    }>((parent, params) => {
      return showDialog(parent, (translate) => ({
        type: 'success',
        icon: successIcon,
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

    showWarnDialog: createDialogFunction<{
      message: string;
      title?: string;
      okText?: string;
    }>((parent, params) => {
      return showDialog(parent, (translate) => ({
        type: 'warning',
        icon: warningIcon,
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

    showErrorDialog: createDialogFunction<{
      message: string;
      title?: string;
      okText?: string;
    }>((parent, params) => {
      return showDialog(parent, (translate) => ({
        type: 'danger',
        icon: errorIcon,
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
      {
        message: string;
        title?: string;
        okText?: string;
        cancelText?: string;
      },
      boolean
    >((parent, params) => {
      return showDialog(parent, (translate) => ({
        type: 'default',
        icon: confirmationIcon,
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
      {
        message: string;
        title?: string;
        okText?: string;
        cancelText?: string;
      },
      boolean
    >((parent, params) => {
      return showDialog(parent, (translate) => ({
        type: 'danger',
        icon: approvalIcon,
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
      {
        message: string;
        title?: string;
        okText?: string;
        cancelText?: string;
        value?: string;
      },
      string | null
    >((parent, params) => {
      const inputField = document.createElement('sl-input');
      inputField.name = 'input';
      inputField.value = params.value || '';
      inputField.size = 'small';
      inputField.setAttribute('autofocus', '');

      return showDialog(parent, (translate) => ({
        type: 'default',
        icon: inputIcon,
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

function showDialog<T = void>(
  parent: HTMLElement,
  init: (translate: (key: string) => string) => DialogConfig<T>
): Promise<T> {
  const target =
    parent ||
    document.querySelector('#app') ||
    document.querySelector('#root') ||
    document.body;

  const currentLang = getLanguage(target);
  const currentDir = getDirection(target);

  const params = init((key) =>
    translate(currentLang, `shoelaceWidgets.dialogs/${key}`)
  );

  const container = document.createElement('div');
  container.attachShadow({ mode: 'open' });
  const containerShadow = container.shadowRoot!;

  const setText = (text: string | undefined, selector: string) => {
    const target = containerShadow.querySelector<HTMLElement>(selector)!;

    if (text) {
      target.innerText = text;
    }
  };

  // required custom elements
  void (SlButton || SlIcon || SlInput || SlDialog);

  containerShadow.innerHTML = `
    <style>
    </style>
    <form class="form" dir=${currentDir}>
      <sl-dialog open class="dialog">
        <div slot="label" class="header">
          <sl-icon class="icon"></sl-icon>
          <div class="title"></div>
        </div>
        <div class="message"></div>
        <div class="content"></div>
        <div slot="footer" class="buttons"></div>
      </sl-dialog>
    </form>
  `;

  setText(params.title, '.title');
  setText(params.message, '.message');

  const form = containerShadow.querySelector<HTMLFormElement>('form.form')!;
  const dialog = containerShadow.querySelector<SlDialog>('sl-dialog.dialog')!;
  const contentBox =
    containerShadow.querySelector<HTMLDivElement>('div.content')!;

  if (params.content) {
    contentBox.append(params.content);
  }

  form.addEventListener('submit', (ev: any) => {
    ev.preventDefault();

    // This will be run before the button submit event is dispatched.
    // That's why the logic logic here will be deferred.

    setTimeout(() => {
      const formData = new FormData(form);
      const data: Record<string, string> = {};

      formData.forEach((value: FormDataEntryValue, key: string) => {
        data[key] = value.toString();
      });

      contentBox.removeEventListener('keydown', onKeyDown);
      buttonBox.removeEventListener('keydown', onKeyDown);
      container.remove();
      containerShadow.innerHTML = '';

      emitResult(params.mapResult?.(data));
    }, 0);
  });

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault();
  });

  const icon = containerShadow.querySelector<SlIcon>('sl-icon.icon')!;
  icon.classList.add(`${params.type}`);
  icon.src = params.icon;

  setText(dialogsStyles.toString(), 'style');

  const buttonBox: HTMLElement = containerShadow.querySelector('.buttons')!;
  const hiddenField = document.createElement('input');

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      container.remove();
      emitResult(params.defaultResult);
    }
  };

  contentBox.addEventListener('keydown', onKeyDown);
  buttonBox.addEventListener('keydown', onKeyDown);

  hiddenField.type = 'hidden';
  hiddenField.name = 'button';
  buttonBox.append(hiddenField);

  const hasPrimaryButton = params.buttons.some(
    (it) => it.variant === 'primary'
  );

  params.buttons.forEach(({ text, variant = 'default' }, idx) => {
    const button: SlButton = document.createElement('sl-button');
    button.type = 'submit';
    button.className = 'button';
    button.variant = variant;
    button.innerText = text;

    if (variant === 'primary' || (!hasPrimaryButton && idx === 0)) {
      button.setAttribute('autofocus', '');
    }

    button.onclick = () => {
      // This will be run after an submit event will be
      // dispatched for the corresponding form element.
      // That's why the form submit event handler logic
      // will be deferred.
      hiddenField.value = String(idx);
    };

    buttonBox.append(button);
  });

  (target.shadowRoot || target).appendChild(container);

  const elem = dialog.querySelector<HTMLElement>('[autofocus]');

  if (elem && typeof elem.focus === 'function') {
    setTimeout(() => elem.focus());
  }

  let emitResult: (result: any) => void;

  return new Promise((resolve) => {
    emitResult = (result: any) => {
      setTimeout(() => resolve(result), 50);
    };
  });
}

const {
  showApproveDialog,
  showConfirmDialog,
  showErrorDialog,
  showInfoDialog,
  showInputDialog,
  showSuccessDialog,
  showWarnDialog
} = createDialogFunctions(showDialog);
