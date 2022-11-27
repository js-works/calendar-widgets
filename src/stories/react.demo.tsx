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

  const onOpenDialogClick = async () => {
    const formData = await showDialog('input', {
      title: 'New user',
      okText: 'Add user',
      labelLayout: 'horizontal',
      width: '34rem',
      padding: '0 0.5rem',

      content: (
        <>
          <Fieldset caption="User">
            <TextField name="firstName" label="First name" required />
            <TextField name="lastName" label="Last name" required />
            <TextField type="email" name="email" label="Email" required />
          </Fieldset>
          <Fieldset caption="Account">
            <TextField label="Username" name="username" required />
            <TextField
              type="password"
              label="Password"
              name="password"
              required
            />
          </Fieldset>
        </>
      )
    });

    /*
    dialogs.info({
      title: 'Form data',
      message: JSON.stringify(formData, null, 2)
    });
    */
  };

  return (
    <div className="react-demo">
      <style>{styles}</style>
      <h3 className="headline">Dialogs</h3>
      <SlButton onClick={onOpenDialogClick}>Open dialog</SlButton>
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
