import {
  h,
  render as mount,
  Ref,
  ComponentChild,
  VNode,
  Fragment
} from 'preact';

import { useEffect, useState } from 'preact/hooks';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { AbstractDialogsController } from '../main/shoelace-widgets/controllers/vanilla/dialogs';
import { LocalizeController } from '@shoelace-style/localize';

import { useDialogs } from '../main/shoelace-widgets-preact';

export const preactDemo = () => {
  const container = document.createElement('div');

  mount(<Demo />, container);

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
          <sx-text-field label="Username" name="username" required />
          <sx-text-field label="Password" name="password" required />
        </>
      )
    });
  };

  return (
    <div>
      <h3>Dialogs</h3>
      <sl-button onclick={onOpenDialogClick}>Open dialog</sl-button>
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
