import { h, VNode } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { AbstractDialogsController } from '../shared/dialogs/abstract-dialogs-controller';
import { LocalizeController } from '@shoelace-style/localize';

// === exports =======================================================

export { useDialogs };

// === local classes =================================================

class DialogsController extends AbstractDialogsController<VNode> {
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
        forceUpdate();
        return Promise.resolve() as any;
      }
    });

    this.#localize = new LocalizeController(host);

    setRenderer(() =>
      h(
        'span',
        null,
        [...this.#renderers].map((it) => it())
      )
    );
  }
}

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
        forceUpdate
      );

      return [dialogCtrl, renderDialogs!];
    }
  );

  useEffect(() => {
    controllers.forEach((it) => it.hostUpdated?.());
  });

  return [dialogCtrl, renderDialogs];
}
