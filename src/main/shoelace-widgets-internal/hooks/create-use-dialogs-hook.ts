import {
  AbstractDialogsController,
  ShowDialogFunction,
  ShowToastFunction
} from '../controllers/abstract-dialogs-controller';

import { StandardDialog } from '../components/standard-dialog/standard-dialog';
import { StandardToast } from '../components/standard-toast/standard-toast';

export function createUseDialogsHook<VNode>(params: {
  createElement: any; // TODO!!!!!!!!!!!!!!!!!
  useState: any; // TODO!!!!!!!!!!!!!!!!!!!!!!,
  render: any; // TODO!!!!!!
}) {
  return function useDialogs(): {
    showDialog: ShowDialogFunction<VNode>;
    showToast: ShowToastFunction<VNode>;
    renderDialogs: () => VNode;
  } {
    const [, setDummy] = params.useState(0);

    const forceUpdate = () =>
      setDummy((it: number) => (it + 1) % Number.MAX_SAFE_INTEGER);

    return params.useState(() => {
      const dialogCtrl = new DialogsController({
        createElement: params.createElement,
        render: params.render,
        forceUpdate
      });

      return {
        showDialog: dialogCtrl.show.bind(dialogCtrl),
        showToast: dialogCtrl.toast.bind(dialogCtrl),
        renderDialogs: dialogCtrl.render.bind(dialogCtrl)
      };
    })[0];
  };
}

// === local classes =================================================

class DialogsController<N> extends AbstractDialogsController<N> {
  static {
    // required dependencies (to avoid too much tree shaking)
    void [StandardDialog, StandardToast];
  }

  readonly #forceUpdate: () => void;

  readonly #renderers: {
    id: number;
    render: () => N;
  }[] = [];

  #createElement: any; // TOO!!!!!
  #nextRendererId = 1;

  constructor(params: {
    createElement: any; // TODO!!!!!
    forceUpdate: () => void;
    render: (vnode: N, target: HTMLElement) => void;
  }) {
    let dialogResolve: ((dialogResult: unknown) => void) | null = null;

    const h = params.createElement;

    super({
      showDialog: (type, options) => {
        const rendererId = this.#addRenderer((key) =>
          h(
            'sx-standard-dialog--internal',
            {
              key,

              ref: (elem: any) => {
                if (elem) {
                  elem.config = { type, ...options };

                  elem.resolve = (result: unknown) => {
                    this.#removeRenderer(rendererId);
                    dialogResolve!(result);
                  };
                }
              }
            },
            h('form', null, options.content)
          )
        );

        return new Promise<unknown>((resolve) => {
          dialogResolve = resolve;
        }) as Promise<any>;
      },

      showToast: (type, options) => {
        let contentElement: HTMLElement | null;

        if (options.content) {
          contentElement = document.createElement('span');
          params.render(options.content, contentElement);
        }

        const rendererId = this.#addRenderer((key) => {
          return h('sx-standard-toast--internal', {
            key,

            ref: (elem: any) => {
              if (elem) {
                elem.config = { type, ...options };
                elem.contentElement = contentElement;
                elem.dismissToast = () => this.#removeRenderer(rendererId);
              }
            }
          });
        });
      }
    });

    this.#createElement = params.createElement;
    this.#forceUpdate = params.forceUpdate;
  }

  #addRenderer(render: (key: number) => N): number {
    const rendererId = this.#nextRendererId++;

    this.#renderers.push({
      id: rendererId,
      render: () => render(rendererId)
    });

    this.#forceUpdate();
    return rendererId;
  }

  #removeRenderer(rendererId: number) {
    const idx = this.#renderers.findIndex((it) => it.id === rendererId);
    this.#renderers.splice(idx, 1);
    this.#forceUpdate();
  }

  render() {
    return this.#createElement(
      'span',
      null,
      this.#renderers.map((it) => it.render())
    );
  }
}
