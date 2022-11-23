import { createElement as h, ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { AbstractDialogsController } from '../shoelace-widgets/dialogs/dialogs';
import { LocalizeController } from '@shoelace-style/localize';

export { useDialogs };

class DialogsController extends AbstractDialogsController<ReactNode> {
  #localize: LocalizeController;
  #renderers = new Set<() => ReactNode>();

  constructor(
    host: HTMLElement & ReactiveControllerHost,
    setRenderer: (renderer: () => ReactNode) => void,
    forceUpdate: () => void
  ) {
    super({
      translate: (key) => this.#localize.term(`shoelaceWidgets.dialogs/${key}`),
      showDialog: (config) => {
        const renderer = () =>
          h(
            DynDialog,
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

function useDialogs(): [DialogsController, () => ReactNode] {
  const [, setToggle] = useState(false);
  const forceUpdate = () => setToggle((it) => !it);
  const [controllers] = useState(() => new Set<ReactiveController>());

  const [[dialogCtrl, renderDialogs]] = useState(
    (): [DialogsController, () => ReactNode] => {
      let renderDialogs: () => ReactNode;

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

function DynDialog(props: {
  config: any;
  dismissDialog: any;
  emitResult: any;
}) {
  const elemRef = useRef<any>();

  useEffect(() => {
    const dynDialog = elemRef.current!;
    dynDialog.config = props.config;
    dynDialog.dismissDialog = props.dismissDialog;
    dynDialog.emitResult = props.emitResult;
  }, []);

  return h('dyn-dialog', { ref: elemRef }, props.config.content);
}
