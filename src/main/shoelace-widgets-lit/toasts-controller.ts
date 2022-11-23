import { html, LitElement, PropertyValueMap } from 'lit';
import { createRef, ref } from 'lit/directives/ref';
import { customElement, property, state } from 'lit/decorators';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat';
import { AbstractToastsController } from '../shoelace-widgets/controllers/vanilla/toasts';
import type { ToastConfig } from '../shoelace-widgets/controllers/vanilla/toasts';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';

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
// === local classes =================================================

@customElement('dyn-toast')
class DynToast extends LitElement {
  @property({ attribute: false })
  config!: ToastConfig<unknown>;

  static {
    // required components (just to prevent too much tree shaking)
    void SlAlert;
  }

  private readonly _alertRef = createRef<SlAlert>();

  protected override firstUpdated() {
    this._alertRef.value!.toast();
  }

  render() {
    const config = this.config;
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
        ?closable=${config.closable ?? false}
        ${ref(this._alertRef)}
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

// === exported classes ==============================================

class ToastsController extends AbstractToastsController<TemplateResult> {
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

  #showToast(config: ToastConfig<TemplateResult>) {
    const renderer = () => this.#renderToast(config);
    this.#toastRenderers.add(renderer);
    this.#host.requestUpdate();
  }

  #renderToast(config: ToastConfig<TemplateResult>) {
    return html`<dyn-toast .config=${config}></dyn-toast>`;
  }
}
