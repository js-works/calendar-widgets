import {
  h,
  render as mount,
  Ref,
  ComponentChild,
  VNode,
  Fragment
} from 'preact';

import { useDialogs, useToasts } from '../main/shoelace-widgets-preact';

export const preactDemo = () => {
  const container = document.createElement('div');
  mount(<Demo />, container);
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

  const showToast = (type: 'info' | 'success' | 'warning' | 'error') => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    (toasts as any)[type === 'warning' ? 'warn' : type]({
      title: type[0].toUpperCase() + type.substring(1),
      message: 'Toast was opened at ' + time
    });
  };

  return (
    <div>
      <h3>Dialogs</h3>
      <sl-button onclick={onOpenDialogClick}>Open dialog</sl-button>
      <h3>Toasts</h3>
      <sl-button-group>
        <sl-button onclick={() => showToast('info')}>Info</sl-button>
        <sl-button onclick={() => showToast('success')}>Success</sl-button>
        <sl-button onclick={() => showToast('warning')}>Warning</sl-button>
        <sl-button onclick={() => showToast('error')}>Error</sl-button>
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
