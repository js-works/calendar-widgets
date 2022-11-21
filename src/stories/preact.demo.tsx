import { h, render as mount, Ref, ComponentChild, VNode } from 'preact';

import { useContext, useEffect, useState, useRef } from 'preact/hooks';
import { html, render, ReactiveController, ReactiveControllerHost } from 'lit';
import { AbstractDialogsController } from '../main/shoelace/controllers/vanilla/dialogs';
import { LocalizeController } from '@shoelace-style/localize';

type ExtraInputConfigParams = {
  labelLayout?: 'vertical' | 'horizontal' | 'auto';
};

class DialogsController extends AbstractDialogsController<
  VNode,
  ExtraInputConfigParams
> {
  #localize: LocalizeController;
  #renderers = new Set<() => VNode>();

  constructor(
    host: HTMLElement & ReactiveControllerHost,
    setRenderer: (renderer: () => VNode) => void,
    forceUpdate: () => void
  ) {
    super({
      translate: (key) => this.#localize.term(`shoelaceWidgets.dialogs/${key}`),
      showDialog: (config) => {
        const renderer = () =>
          h(
            'dyn-dialog' as any,
            {
              config,

              dismissDialog: () => {
                this.#renderers.delete(renderer);
                forceUpdate();
              },

              emitResult: (result: any) => {
                //return emitResult(result);
              }
            },
            config.content
          );

        this.#renderers.add(renderer);

        return Promise.resolve() as any;
      }
    });

    this.#localize = new LocalizeController(host);

    setRenderer(() =>
      h(
        'span',
        { style: { border: '1px solid red' } },
        //[...this.#renderers].map((it) => it())
        this.#renderers.size
      )
    );
  }
}

export const preactDemo = () => {
  const container = document.createElement('div');

  mount(h(Demo, null), container);

  return container;
};

function useDialogs(): [DialogsController, () => VNode] {
  const [, setToggle] = useState(false);
  const forceUpdate = () => setToggle((it) => !it);
  const [controllers] = useState(() => new Set<ReactiveController>());

  const [[dialogCtrl, renderDialogs]] = useState(
    (): [DialogsController, () => VNode] => {
      let renderDialogs: () => VNode;

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

      const proxy = new Proxy(document.createElement('div'), {
        get(target, prop) {
          return host.hasOwnProperty(prop)
            ? (host as any)[prop]
            : (target as any)[prop];
        }
      }) as unknown as HTMLElement & ReactiveControllerHost;

      const dialogCtrl = new DialogsController(
        proxy,
        (renderer) => (renderDialogs = renderer),
        () => {} //TODO!!!!
      );

      return [dialogCtrl, renderDialogs!];
    }
  );

  useEffect(() => {
    controllers.forEach((it) => it.hostUpdated?.());
  });

  return [dialogCtrl, renderDialogs];
}

function Demo() {
  const [dialogs, renderDialogs] = useDialogs();

  const onOpenDialogClick = () => {
    dialogs.error({ message: 'Juhu' });
  };

  return h(
    'div',
    null,
    h('h3', null, 'Dialogs'),
    h('sl-button', { onClick: onOpenDialogClick }, 'Open dialog'),
    renderDialogs()
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
