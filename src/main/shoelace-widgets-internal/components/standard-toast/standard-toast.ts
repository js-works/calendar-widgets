import { html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';

import type {
  ToastConfig,
  ToastType
} from '../../controllers/abstract-toasts-controller';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';

// icons
import infoIcon from '../../../shoelace-widgets/icons/bootstrap/info-circle.icon';
import successIcon from '../../../shoelace-widgets/icons/bootstrap/check-circle.icon';
import warningIcon from '../../../shoelace-widgets/icons/bootstrap/exclamation-circle.icon';
import errorIcon from '../../../shoelace-widgets/icons/bootstrap/exclamation-triangle.icon';

// === exports =======================================================

export { StandardToast };

// === local constants ===============================================

const defaultDuration = 3000;

const variantByToastType = {
  info: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'danger'
};

const iconByToastType = {
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon
};

// === components =================================================???

@customElement('sx-standard-toast')
class StandardToast extends LitElement {
  @property({ attribute: false })
  config: ToastConfig<unknown> | null = null;

  @property({ attribute: false })
  contentElement: HTMLElement | null = null;

  @property({ attribute: false })
  dismissToast: (() => void) | null = null;

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
      this.dismissToast!();
    }
  }

  render() {
    if (this._toastPerformed || !this.config || !this.dismissToast) {
      return null;
    }

    const config = this.config;
    const duration = config.duration ?? defaultDuration;
    const variant = variantByToastType[this.config.type];
    const icon = iconByToastType[this.config.type!];

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
