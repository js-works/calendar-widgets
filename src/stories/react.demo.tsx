// @jsx createElement
import { createContext, createElement, Ref, ReactNode } from 'react';

import React from 'react';

import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';

import { useContext, useEffect, useState, useRef } from 'react';
import { html, render, ReactiveController, ReactiveControllerHost } from 'lit';
import { DialogsController } from '../main/shoelace-widgets-lit';

export const reactDemo = () => {
  const container = document.createElement('div');

  const root = createRoot(container);
  root.render(<Demo />);

  return container;
};

const LangCtx = createContext('de-CH');

function useDialogs(): [DialogsController, () => JSX.Element] {
  const [, setToggle] = useState(false);
  const forceUpdate = () => setToggle((it) => !it);

  const dialogsContainer = document.createElement('span');
  dialogsContainer.attachShadow({ mode: 'open' });
  const controllers = new Set<ReactiveController>();

  const host: ReactiveControllerHost = {
    addController(controller) {
      controllers.add(controller);
    },

    removeController(controller) {
      controllers.delete(controller);
    },

    requestUpdate: () => forceUpdate(),

    get updateComplete() {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(true), 100);
      });
    }
  };

  const proxy = new Proxy(dialogsContainer, {
    get(target, prop) {
      return host.hasOwnProperty(prop)
        ? (host as any)[prop]
        : (target as any)[prop];
    }
  }) as unknown as HTMLElement & ReactiveControllerHost;

  const [dialogCtrl] = useState(() => {
    return new DialogsController(proxy);
  });

  const elemRef = useRef<HTMLSpanElement>(null);
  const renderDialogs = () => (
    <div>
      <span ref={elemRef}></span>
      {createPortal(<ShowLang />, document.createElement('div'))}
    </div>
  );

  useEffect(() => {
    const elem = elemRef.current!;

    if (!elem.shadowRoot) {
      //elem.attachShadow({ mode: 'open' });
    }

    //render(html`${dialogsContainer} ${dialogCtrl.render()}`, elem);
    // TODO!!! // (<ShowLang />, elem);
    controllers.forEach((it) => it.hostUpdated?.());
  });

  return [dialogCtrl, renderDialogs];
}

function Demo() {
  const [dialogs, renderDialogs] = useDialogs();

  const onOpenDialogClick = () => {
    dialogs.error({ message: 'Juhu' });
  };

  return (
    <div>
      <h3>Dialogs</h3>
      <LangCtx.Provider value="xxx">
        <sl-button onclick={onOpenDialogClick}>Open dialog</sl-button>
        {renderDialogs()}
      </LangCtx.Provider>
    </div>
  );
}

function ShowLang() {
  const lang = useContext(LangCtx);
  return <div>{lang}</div>;
}

// TODO!!!

type Adjust<T> = {
  [K in keyof T]: Partial<Omit<T[K], 'children'>> & {
    ref?: Ref<T[K]>;
    children?: ReactNode;
  };
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends Adjust<HTMLElementTagNameMap> {}
  }
}
