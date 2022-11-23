import { html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';
import type { ToastConfig, ToastType } from './toasts';
import { generateUniqueTagName } from '../../shoelace-widgets/misc/utils';
// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';

// icons
import infoIcon from '../../shoelace-widgets/icons/bootstrap/info-circle.icon';
import successIcon from '../../shoelace-widgets/icons/bootstrap/check-circle.icon';
import warningIcon from '../../shoelace-widgets/icons/bootstrap/exclamation-circle.icon';
import errorIcon from '../../shoelace-widgets/icons/bootstrap/exclamation-triangle.icon';

// === exports =======================================================

export { DynamicToast };

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

const tagName = generateUniqueTagName('dynamic-toast--internal');

@customElement(tagName)
class DynamicToast extends LitElement {
  static tagName = tagName;

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
