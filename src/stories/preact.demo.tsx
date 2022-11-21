// @jsx h
import {
  createContext,
  h,
  render as mount,
  Ref,
  ComponentChild,
  VNode
} from 'preact';
import { createPortal } from 'preact/compat';
import { useContext, useEffect, useState, useRef } from 'preact/hooks';
import { html, render, ReactiveController, ReactiveControllerHost } from 'lit';
import { DialogsController } from '../main/shoelace-widgets-lit';

export const preactDemo = () => {
  const container = document.createElement('div');

  mount(<Demo />, container);

  return container;
};

const LangCtx = createContext('de-CH');

function useDialogs(): [DialogsController, () => VNode] {
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
      return Object.hasOwn(host, prop)
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
    mount(<ShowLang />, elem);
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
    children?: ComponentChild;
  };
};

declare global {
  namespace preact.JSX {
    interface IntrinsicElements extends Adjust<HTMLElementTagNameMap> {}
  }
}
