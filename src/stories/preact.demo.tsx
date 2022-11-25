import { h, render, Ref, ComponentChild, Fragment } from 'preact';

import {
  useDialogs,
  useToasts,
  ToastType
} from '../main/shoelace-widgets-preact';

export const preactDemo = () => {
  const container = document.createElement('div');
  render(<Demo />, container);
  return container;
};

function Demo() {
  const [dialogs, renderDialogs] = useDialogs();
  const [toasts, renderToasts] = useToasts();

  const onOpenDialogClick = () => {
    dialogs.input({
      title: 'Switch user',
      labelLayout: 'horizontal',
      width: '25rem',

      content: (
        <>
          <sx-text-field label="Username" name="username" required />
          <sx-text-field label="Password" name="password" required />
        </>
      )
    });
  };

  const showToast = (type: ToastType, title: string) => {
    const now = new Date();

    const time = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(11, 19);

    toasts.show({
      type,
      title,
      message: 'Toast was opened at ' + time,
      content: <strong>Some extra content ...</strong>
    });
  };

  return (
    <div>
      <h3>Dialogs</h3>
      <sl-button onclick={onOpenDialogClick}>Open dialog</sl-button>
      <h3>Toasts</h3>
      <sl-button-group>
        <sl-button onclick={() => showToast('information', 'Info')}>
          Info
        </sl-button>
        <sl-button onclick={() => showToast('success', 'Success')}>
          Success
        </sl-button>
        <sl-button onclick={() => showToast('warning', 'Warning')}>
          Warning
        </sl-button>
        <sl-button onclick={() => showToast('error', 'Error')}>Error</sl-button>
      </sl-button-group>
      {renderDialogs()}
      {renderToasts()}
    </div>
  );
}

// TODO!!!

type Adjust<T> = {
  [K in keyof T]: Partial<Omit<T[K], 'children'>> & {
    ref?: Ref<T[K]>;
    children?: ComponentChild;
  };
};

declare global {
  namespace preact.JSX {
    interface IntrinsicElements extends Adjust<HTMLElementTagNameMap> {}
  }
}
