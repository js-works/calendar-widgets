/* @jsx createElement */
import { createElement, Ref, ReactNode, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { useDialogs } from '../main/shoelace-widgets-react';
import { SlButton, SlButtonGroup } from '@shoelace-style/shoelace/dist/react';
import { Fieldset, TextField } from '../main/shoelace-widgets-react';
import type { ToastType } from '../main/shoelace-widgets-react';

const styles = /*css*/ `
  .react-demo .headline {
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
  }
`;

export const reactDemo = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<Demo />);
  return container;
};

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
      label: 'Your name',
      required: true
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
      width: '25rem',

      content: (
        <Fieldset label-layout="horizontal">
          <TextField label="Username" name="username" required autofocus />

          <TextField
            type="password"
            label="Password"
            name="password"
            required
          />
        </Fieldset>
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
      content: <strong>Some extra content...</strong>
    });
  };

  return (
    <div className="react-demo">
      <style>{styles}</style>
      <h3 className="headline">Dialogs</h3>
      <SlButton onClick={onInfoDialogClick}>Info</SlButton>
      <SlButton onClick={onErrorDialogClick}>Error</SlButton>
      <SlButton onClick={onPromptDialogClick}>Prompt</SlButton>
      <SlButton onClick={onInputDialogClick}>Input</SlButton>
      <h3 className="headline">Toasts</h3>
      <SlButtonGroup>
        <SlButton onclick={() => openToast('info', 'Info')}>Info</SlButton>
        <SlButton onclick={() => openToast('success', 'Success')}>
          Success
        </SlButton>
        <SlButton onclick={() => openToast('warn', 'Warning')}>
          Warning
        </SlButton>
        <SlButton onclick={() => openToast('error', 'Error')}>Error</SlButton>
      </SlButtonGroup>
      {renderDialogs()}
    </div>
  );
}
