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

// === exported classes ==============================================

class DialogsController extends AbstractDialogsController<TemplateResult> {
  static {
    // required components (just to avoid too much tree shaking)
    void [StandardDialog, StandardToast];
  }

  readonly #host: ReactiveControllerHost;

  readonly #renderers: {
    id: number;
    render: () => TemplateResult;
  }[] = [];

  #nextRendererId = 1;

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
          this.#renderers,
          ({ id }) => id,
          ({ render }) => html`${render()}`
        )}
      </span>
    `;
  }

  async #showDialog(config: DialogConfig<TemplateResult>) {
    let resolveDialogResult: ((result: unknown) => void) | null = null;

    const rendererId = this.#addRenderer(
      () =>
        html`
          <sx-standard-dialog--internal
            .config=${config}
            .resolve=${(result: unknown) => {
              this.#removeRenderer(rendererId);
              resolveDialogResult!(result);
            }}
          >
            ${config.content}
          </sx-standard-dialog--internal>
        `
    );

    return new Promise<unknown>((resolve) => {
      resolveDialogResult = resolve;
    }) as unknown as any;
  }

  #showToast(config: ToastConfig<TemplateResult>) {
    let contentElem: HTMLElement | null = null;

    if (config.content) {
      contentElem = document.createElement('div');
      render(config.content, contentElem);
    }

    const rendererKey = this.#addRenderer(
      () => html`
        <sx-standard-toast--internal
          .config=${config}
          .contentElement=${contentElem}
          .dismissToast=${() => this.#removeRenderer(rendererKey)}
        ></sx-standard-toast--internal>
      `
    );
  }

  #addRenderer(render: () => TemplateResult): number {
    const rendererId = this.#nextRendererId++;

    this.#renderers.push({
      id: rendererId,
      render
    });

    this.#host.requestUpdate();
    return rendererId;
  }

  #removeRenderer(rendererId: number) {
    const idx = this.#renderers.findIndex((it) => it.id === rendererId);
    this.#renderers.splice(idx, 1);
    this.#host.requestUpdate();
  }
}
