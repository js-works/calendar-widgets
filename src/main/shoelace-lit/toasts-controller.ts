import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref';
import type { Ref } from 'lit/directives/ref';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat';
import { AbstractToastsController } from '../shoelace/controllers/vanilla/toasts';
import type { ToastConfig } from '../shoelace/controllers/vanilla/toasts';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';

// icons
import infoIcon from '../shoelace/icons/bootstrap/info-circle.icon';
import successIcon from '../shoelace/icons/bootstrap/check-circle.icon';
import warningIcon from '../shoelace/icons/bootstrap/exclamation-circle.icon';
import errorIcon from '../shoelace/icons/bootstrap/exclamation-triangle.icon';

// === exports =======================================================

export { ToastsController };

// === local types ===================================================

type ExtraParams = {
  closeable?: boolean;
};

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

class ToastsController extends AbstractToastsController<
  TemplateResult,
  ExtraParams
> {
  static {
    // required components (just to prevent too much tree shaking)
    void SlAlert;
  }

  readonly #host: ReactiveControllerHost;
  readonly #toastRenderers = new Set<() => TemplateResult>();

  constructor(host: ReactiveControllerHost) {
    super({
      showToast: (config) => this.#showToast(config)
    });

    this.#host = host;
  }

  render(): TemplateResult {
    return html`${repeat(this.#toastRenderers, (it) => it())}`;
  }

  #showToast = async (config: ToastConfig<TemplateResult, ExtraParams>) => {
    let alertRef = createRef<SlAlert>();
    const renderer = () => this.#renderToast(config, alertRef);
    this.#toastRenderers.add(renderer);
    this.#host.requestUpdate();
    await this.#host.updateComplete;
    alertRef.value!.toast();
  };

  #renderToast(
    config: ToastConfig<TemplateResult, ExtraParams>,
    alertRef: Ref<SlAlert>
  ) {
    const duration = config.duration ?? 3000;
    const variant = variants[config.type];
    const icon = icons[config.type];

    const title =
      typeof config.title === 'function' ? config.title() : config.title;

    const message =
      typeof config.message === 'function' ? config.message() : config.message;

    return html`
      <sl-alert
        variant=${variant}
        duration=${duration}
        ?closable=${config.closeable ?? false}
        ${ref(alertRef)}
        style="user-select: none"
      >
        <sl-icon slot="icon" src=${icon}></sl-icon>
        <strong>${title}</strong>
        <div>${message}</div>
        <div>${config.content}</div>
      </sl-alert>
    `;
  }
}
