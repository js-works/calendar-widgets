import { h, VNode, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import {
  AbstractDialogsController,
  ShowDialogFunction,
  ShowToastFunction
} from 'shoelace-widgets/internal';

// === exports =======================================================

export { useDialogs };

// === local classes =================================================

class DialogsController extends AbstractDialogsController<VNode> {
  #renderers = new Set<() => VNode>();

  constructor(
    host: HTMLElement & ReactiveControllerHost,
    setRenderer: (renderer: () => VNode) => void,
    forceUpdate: () => void
  ) {
    let dialogResolve: ((value: unknown) => void) | null = null;

    super({
      showDialog: (type, options) => {
        const renderer = () =>
          h(
            'sx-standard-dialog--internal',
            {
              config: { type, ...options },

              dismissDialog: (result: unknown) => {
                this.#renderers.delete(renderer);
                dialogResolve?.(result);
                forceUpdate();
              }
            } as any,
            options.content
          );

        this.#renderers.add(renderer);
        forceUpdate();

        return new Promise<unknown>((resolve) => {
          dialogResolve = resolve;
        }) as any;
      },

      showToast: (type, options) => {
        let contentElement: HTMLElement | null;

        if (options.content) {
          contentElement = document.createElement('span');
          render(options.content, contentElement);
        }

        const dismissToast = () => {
          this.#renderers.delete(renderToast);
          forceUpdate();
        };

        const renderToast = () => {
          return h('sx-standard-toast--internal' as any, {
            config: { type, ...options },
            contentElement,
            dismissToast
          });
        };

        this.#renderers.add(renderToast);
        forceUpdate();
      }
    });

    setRenderer(() =>
      h(
        'span',
        null,
        [...this.#renderers].map((it) => it())
      )
    );
  }

  render(): VNode {
    return h(
      'span',
      null,
      [...this.#renderers].map((it, key) => h('span', { key }, it()))
    );
  }
}

function useDialogs(): {
  showDialog: ShowDialogFunction<VNode>;
  showToast: ShowToastFunction<VNode>;
  renderDialogs: () => VNode;
} {
  const [, setToggle] = useState(false);
  const forceUpdate = () => setToggle((it) => !it);
  const [controllers] = useState(() => new Set<ReactiveController>());

  const [{ showDialog, showToast, renderDialogs }] = useState(() => {
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

    const showDialog = dialogCtrl.show.bind(dialogCtrl);
    const showToast = dialogCtrl.toast.bind(dialogCtrl);

    return { showDialog, showToast, renderDialogs: renderDialogs! };
  });

  useEffect(() => {
    controllers.forEach((it) => it.hostUpdated?.());
  });

  return { showDialog, showToast, renderDialogs };
}
