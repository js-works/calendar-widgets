import { html, render } from 'lit';
import { AbstractToastsController } from '../shoelace-widgets-internal/controllers/abstract-toasts-controller';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import type {
  ToastConfig,
  ToastType
} from '../shoelace-widgets-internal/controllers/abstract-toasts-controller';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';
import { StandardToast } from 'shoelace-widgets/internal';

// === exports =======================================================

export { ToastsController };

// === exported classes ==============================================

class ToastsController extends AbstractToastsController<TemplateResult> {
  readonly #host: ReactiveControllerHost;
  readonly #toastRenderers = new Set<() => TemplateResult>();

  static {
    // required components (to prevent too much tree shaking)
    void [SlAlert, StandardToast];
  }

  constructor(host: ReactiveControllerHost) {
    super({
      showToast: (config) => this.#showToast(config)
    });

    this.#host = host;
  }

  render(): TemplateResult {
    return html`${repeat(this.#toastRenderers, (it) => it())}`;
  }

  #showToast(config: ToastConfig<TemplateResult>) {
    const dismissToast = () => {
      this.#toastRenderers.delete(renderer);
      this.#host.requestUpdate();
    };

    const renderer = () => this.#renderToast(config, dismissToast);
    this.#toastRenderers.add(renderer);
    this.#host.requestUpdate();
  }

  #renderToast(config: ToastConfig<TemplateResult>, dismissToast: () => void) {
    let contentElem: HTMLElement | null = null;

    if (config.content) {
      contentElem = document.createElement('div');
      render(config.content, contentElem);
    }

    return html`
      <sx-standard-toast--internal
        .config=${config}
        .contentElement=${contentElem}
        .dismissToast=${dismissToast}
      ></sx-standard-toast--internal>
    `;
  }
}
