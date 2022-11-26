import { html, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { ReactiveControllerHost, TemplateResult } from 'lit';

import {
  AbstractDialogsController,
  DialogConfig,
  ToastConfig
} from '../shoelace-widgets-internal/controllers/abstract-dialogs-controller';

import { StandardDialog } from '../shoelace-widgets-internal/components/standard-dialog/standard-dialog';
import { StandardToast } from '../shoelace-widgets-internal/components/standard-toast/standard-toast';

// === exports =======================================================

export { DialogsController };

// === types =========================================================

class DialogsController extends AbstractDialogsController<TemplateResult> {
  static {
    // required components (just to prevent too much tree shaking)
    void [StandardDialog, StandardToast];
  }

  readonly #host: ReactiveControllerHost;

  readonly #dialogs: {
    id: number;
    config: DialogConfig;
    supplyResult: (data: unknown) => void;
  }[] = [];

  readonly #toastRenderers = new Set<() => TemplateResult>();

  #nextDialogId = 1;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    super({
      showDialog: (type, options) =>
        this.#showDialog({ type, ...options } as any) as any,

      showToast: (type, options) => {
        this.#showToast({ type, ...options } as any) as any;
      }
    });

    this.#host = host;
  }

  render(): TemplateResult {
    return html`
      <span>
        ${repeat(
          this.#dialogs,
          ({ id }) => id,
          ({ id, config }) =>
            html`
              <sx-standard-dialog--internal
                data-dialog-id=${id}
                .config=${config}
                .handleDialogClosed=${(result: unknown) =>
                  this.#dismissDialog(id, result)}
              >
                ${config.content}
              </sx-standard-dialog--internal>
            `
        )}
        ${repeat(this.#toastRenderers, (it) => it())}
      </span>
    `;
  }

  async #showDialog(config: DialogConfig<TemplateResult>) {
    let resolveResult: ((result: unknown) => void) | null = null;

    this.#dialogs.push({
      id: this.#nextDialogId++,
      config,
      supplyResult: (result) => resolveResult!(result)
    });

    this.#requestUpdate();

    return new Promise<unknown>((resolve) => {
      resolveResult = resolve;
    }) as unknown as any;
  }

  #dismissDialog(dialogId: number, result: unknown) {
    const idx = this.#dialogs.findIndex((it) => it.id === dialogId);
    const supplyResult = this.#dialogs[idx].supplyResult;
    this.#dialogs.splice(idx, 1);
    supplyResult(result);
  }

  #showToast(config: ToastConfig<TemplateResult>) {
    let contentElem: HTMLElement | null = null;

    if (config.content) {
      contentElem = document.createElement('div');
      render(config.content, contentElem);
    }

    const dismissToast = () => {
      this.#toastRenderers.delete(renderToast);
      this.#requestUpdate();
    };

    const renderToast = () => html`
      <sx-standard-toast--internal
        .config=${config}
        .contentElement=${contentElem}
        .dismissToast=${dismissToast}
      ></sx-standard-toast--internal>
    `;

    this.#toastRenderers.add(renderToast);
    this.#requestUpdate();
  }

  #requestUpdate() {
    this.#host.requestUpdate();
  }
}
