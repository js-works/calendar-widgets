import { h, render, Ref, ComponentChild, Fragment } from 'preact';
import { useDialogs, ToastType } from '../main/shoelace-widgets-preact';

export const preactDemo = () => {
  const container = document.createElement('div');
  render(<Demo />, container);
  return container;
};

function Demo() {
  const { showDialog, showToast, renderDialogs } = useDialogs();

  const onOpenDialogClick = async () => {
    const data = await showDialog('input', {
      title: 'Switch user',
      labelLayout: 'horizontal',
      width: '25rem',

      content: (
        <>
          <sx-text-field label="Username" name="username" required />

          <sx-text-field
            type="password"
            label="Password"
            name="password"
            required
          />
        </>
      )
    });

    if (data) {
      showDialog('info', {
        title: 'Form data',
        message: JSON.stringify(data, null, 2)
      });
    }
  };

  const openToast = (type: ToastType, title: string) => {
    const now = new Date();

    const time = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(11, 19);

    showToast(type, {
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
        <sl-button onclick={() => openToast('info', 'Info')}>Info</sl-button>
        <sl-button onclick={() => openToast('success', 'Success')}>
          Success
        </sl-button>
        <sl-button onclick={() => openToast('warn', 'Warning')}>
          Warning
        </sl-button>
        <sl-button onclick={() => openToast('error', 'Error')}>Error</sl-button>
      </sl-button-group>
      {renderDialogs()}
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
