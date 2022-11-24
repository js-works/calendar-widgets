import { render } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { AbstractToastsController } from '../shared/toasts/abstract-toasts-controller';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import type {
  ToastConfig,
  ToastType
} from '../shared/toasts/abstract-toasts-controller';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';
import { DynamicToast } from '../shared/toasts/dynamic-toast';

// icons
import infoIcon from '../shoelace-widgets/icons/bootstrap/info-circle.icon';
import successIcon from '../shoelace-widgets/icons/bootstrap/check-circle.icon';
import warningIcon from '../shoelace-widgets/icons/bootstrap/exclamation-circle.icon';
import errorIcon from '../shoelace-widgets/icons/bootstrap/exclamation-triangle.icon';

// === exports =======================================================

export { ToastsController };

// === local types ===================================================

// === variant by dialog type ========================================

const variants = {
  info: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'danger'
};

// === icons by dialog type ==========================================

const icons = {
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon
};

// === exported classes ==============================================

class ToastsController extends AbstractToastsController<TemplateResult> {
  readonly #host: ReactiveControllerHost;
  readonly #toastRenderers = new Set<() => TemplateResult>();

  static {
    // required components (to prevent too much tree shaking)
    void [SlAlert, DynamicToast];
  }

  constructor(host: ReactiveControllerHost) {
    super({
      showToast: (type, config) => this.#showToast(type, config)
    });

    this.#host = host;
  }

  render(): TemplateResult {
    return html`${repeat(this.#toastRenderers, (it) => it())}`;
  }

  #showToast(type: ToastType, config: ToastConfig<TemplateResult>) {
    const dismissToast = () => {
      this.#toastRenderers.delete(renderer);
      this.#host.requestUpdate();
    };

    const renderer = () => this.#renderToast(type, config, dismissToast);
    this.#toastRenderers.add(renderer);
    this.#host.requestUpdate();
  }

  #renderToast(
    type: ToastType,
    config: ToastConfig<TemplateResult>,
    dismissToast: () => void
  ) {
    let contentElem: HTMLElement | null = null;

    if (config.content) {
      contentElem = document.createElement('div');
      render(config.content, contentElem);
    }

    const tagLiteral = unsafeStatic(DynamicToast.tagName);

    return html`
      <${tagLiteral}
        .type=${type}
        .config=${config}
        .contentElement=${contentElem}
        .dismissToast=${dismissToast}
      ></${tagLiteral}>
    `;
  }
}
