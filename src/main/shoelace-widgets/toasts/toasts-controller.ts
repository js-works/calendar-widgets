import { html, render, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref';
import { customElement, property, state } from 'lit/decorators';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat';
import { AbstractToastsController } from './toasts';

import type { ToastConfig, ToastType } from './toasts';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';

// icons
import infoIcon from '../icons/bootstrap/info-circle.icon';
import successIcon from '../icons/bootstrap/check-circle.icon';
import warningIcon from '../icons/bootstrap/exclamation-circle.icon';
import errorIcon from '../icons/bootstrap/exclamation-triangle.icon';

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
  type: ToastType | null = null;

  @property({ attribute: false })
  config: ToastConfig<unknown> | null = null;

  @property({ attribute: false })
  contentElement: HTMLElement | null = null;

  static {
    // required components (to prevent too much tree shaking)
    void SlAlert;
  }

  private readonly _alertRef = createRef<SlAlert>();
  private _toastPerformed = false;

  protected override updated() {
    if (this._alertRef.value && !this._toastPerformed) {
      this._toastPerformed = true;
      this._alertRef.value!.toast();
    }
  }

  render() {
    if (!this.config) {
      return null;
    }

    const config = this.config;
    const duration = config.duration ?? 3000;
    const variant = variants[this.type!];
    const icon = icons[this.type!];

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
        <slot>${this.contentElement}</slot>
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
      showToast: (type, config) => this.#showToast(type, config)
    });

    this.#host = host;
  }

  render(): TemplateResult {
    return html`${repeat(this.#toastRenderers, (it) => it())}`;
  }

  #showToast(type: ToastType, config: ToastConfig<TemplateResult>) {
    const renderer = () => this.#renderToast(type, config);
    this.#toastRenderers.add(renderer);
    this.#host.requestUpdate();
  }

  #renderToast(type: ToastType, config: ToastConfig<TemplateResult>) {
    let contentElem: HTMLElement | null = null;

    if (config.content) {
      contentElem = document.createElement('div');
      render(config.content, contentElem);
    }

    return html`
      <dyn-toast
        .type=${type}
        .config=${config}
        .contentElement=${contentElem}
      ></dyn-toast>
    `;
  }
}
