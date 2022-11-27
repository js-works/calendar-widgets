import { h, render, Ref, ComponentChild, Fragment } from 'preact';
import { useDialogs, ToastType } from '../main/shoelace-widgets-preact';

export const preactDemo = () => {
  const container = document.createElement('div');
  render(<Demo />, container);
  return container;
};

const styles = /*css*/ `
  .preact-demo .headline {
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
  }
`;

function Demo() {
  const { showDialog, showToast, renderDialogs } = useDialogs();

  const onInfoDialogClick = () => {
    showDialog('info', {
      message: "It's 7 o'clock in the morning - time to stand up."
    });
  };

  const onErrorDialogClick = () => {
    showDialog('error', {
      message: 'File could not be created.'
    });
  };

  const onPromptDialogClick = async () => {
    const name = await showDialog('prompt', {
      message: 'Please enter your name'
    });

    if (name !== null) {
      showDialog('info', {
        title: 'Welcome',
        message: 'Hello, ' + (name === '' ? 'stranger' : name)
      });
    }
  };

  const onInputDialogClick = async () => {
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
    <div class="preact-demo">
      <style>{styles}</style>
      <h3 class="headline">Dialogs</h3>
      <sl-button-group>
        <sl-button onclick={onInfoDialogClick}>Info</sl-button>
        <sl-button onclick={onErrorDialogClick}>Error</sl-button>
        <sl-button onclick={onPromptDialogClick}>Prompt</sl-button>
        <sl-button onclick={onInputDialogClick}>Input</sl-button>
      </sl-button-group>
      <h3 class="headline">Toasts</h3>
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
