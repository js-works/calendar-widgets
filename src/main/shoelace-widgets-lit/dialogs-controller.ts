import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { ReactiveControllerHost, TemplateResult } from 'lit';

import {
  AbstractDialogsController,
  DialogConfig,
  ShowDialogFunction
} from '../shoelace-widgets-internal/controllers/abstract-dialogs-controller';

import { StandardDialog } from '../shoelace-widgets-internal/components/standard-dialog/standard-dialog';

// === exports =======================================================

export { DialogsController };

// === types =========================================================

class DialogsController extends AbstractDialogsController<TemplateResult> {
  static {
    // required components (just to prevent too much tree shaking)
    void [StandardDialog];
  }

  readonly #host: ReactiveControllerHost;

  readonly #dialogs: {
    id: number;
    config: DialogConfig;
    supplyResult: (data: unknown) => void;
  }[] = [];

  #nextDialogId = 1;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    super({
      showDialog: (config) => this.#showDialog(config as any) as any
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
                .dialogConfig=${config}
                .onDialogClosed=${(result: unknown) =>
                  this.#dismissDialog(id, result)}
              >
              </sx-standard-dialog--internal>
            `
        )}
      </span>
    `;
  }

  #showDialog: ShowDialogFunction<TemplateResult> = async (config) => {
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
  };

  #dismissDialog(dialogId: number, result: unknown) {
    const idx = this.#dialogs.findIndex((it) => it.id === dialogId);
    const supplyResult = this.#dialogs[idx].supplyResult;
    this.#dialogs.splice(idx, 1);
    supplyResult(result);
  }

  #requestUpdate() {
    this.#host.requestUpdate();
  }
}
