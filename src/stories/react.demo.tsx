/* @jsx createElement */
import { createElement, Ref, ReactNode, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { useDialogs } from '../main/shoelace-widgets-react';
import { SlButton } from '@shoelace-style/shoelace/dist/react';
import { Fieldset } from '../main/shoelace-widgets-react';
import { TextField } from '../main/shoelace-widgets-react';

export const reactDemo = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<Demo />);
  return container;
};

function Demo() {
  const [dialogs, renderDialogs] = useDialogs();

  const onOpenDialogClick = () => {
    dialogs.input({
      title: 'Add user',
      labelLayout: 'horizontal',
      width: '25rem',
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
  };

  return (
    <div>
      <h3>Dialogs</h3>
      <SlButton onClick={onOpenDialogClick}>Open dialog</SlButton>
      {renderDialogs()}
    </div>
  );
}
