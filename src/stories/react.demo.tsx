/* @jsx createElement */
import { createElement, Ref, ReactNode, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { useDialogs } from '../main/shoelace-widgets-react';
import { SlButton } from '@shoelace-style/shoelace/dist/react';

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
      title: 'Switch user',
      labelLayout: 'horizontal',
      width: '25rem',

      content: (
        <>
          <div>Juhu</div>
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
