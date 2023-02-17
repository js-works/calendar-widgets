import { html, LitElement, ReactiveControllerHost } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LocalizeController } from '../../i18n/i18n';

import { FormFieldController } from '../../form-fields/form-field-controller';
import { Validators } from '../../form-fields/form-fields';
import type { FormField } from '../../form-fields/form-fields';

// custom elements
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/input/input';
import type SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// styles
import textFieldStyles from './text-field.styles';

// === exports =======================================================

export { TextField };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-text-field': TextField;
  }
}

// === local constants ===============================================

const typeMap: Record<string, string> = {
  password: 'password',
  email: 'email'
};

// === TextField =====================================================

@customElement('sx-text-field')
class TextField extends LitElement implements FormField<string> {
  static styles = textFieldStyles;

  @property()
  form = '';

  @property()
  type: 'text' | 'password' | 'email' | 'phone' | 'cellphone' = 'text';

  @property()
  name = '';

  @property()
  value = '';

  @property()
  defaultValue = '';

  @property()
  label = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean, reflect: true })
  autofocus = false;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  @property()
  autocomplete = '';

  private _slInputRef = createRef<SlInput>();
  private _localize = new LocalizeController(this);

  private _formFieldCtrl = new FormFieldController(this, {
    getDefaultValue: () => this.defaultValue,
    setValue: (value: string) => (this.value = value),

    validation: [
      Validators.required((value) => !this.required || !!value),
      (value) => (this.type !== 'email' ? null : Validators.email()(value))
    ]
  });

  focus() {
    this._slInputRef.value!.focus();
  }

  blur(): void {
    this._slInputRef.value?.blur();
  }

  protected override firstUpdated() {
    Object.defineProperty(this, 'value', {
      get: () => this._slInputRef.value!.value,
      set: (value: string) => void (this._slInputRef.value!.value = value)
    });

    this._slInputRef.value!.updateComplete.then(() => {
      this._formFieldCtrl.updateValidity();

      this._slInputRef.value!.addEventListener('sl-invalid', (ev) =>
        this._onInvalid(ev)
      );
    });
  }

  updated() {
    const input = this._slInputRef.value!;

    input.updateComplete.then(() => {
      this._formFieldCtrl.updateValidity();

      if (this.getAttribute('data-user-valid')) {
        input.setAttribute('data-user-valid', '');
      }

      if (this.getAttribute('data-user-invalid')) {
        input.setAttribute('data-user-invalid', '');
      }
    });
  }

  private _onKeyDown = (ev: KeyboardEvent) => {
    void (ev.key === 'Enter' && this._formFieldCtrl.submit());
  };

  private _onBlur = () => {
    this._formFieldCtrl.suppressError(false);
  };

  private _onInvalid = (ev: Event) => {
    this._formFieldCtrl.emitInvalidEvent(ev);

    this._formFieldCtrl.updateValidity();
  };

  render() {
    const icon =
      this.type === 'email' ||
      this.type === 'phone' ||
      this.type === 'cellphone'
        ? `text-field.${this.type}`
        : null;

    return html`
      <sl-input
        type=${typeMap[this.type] ?? 'text'}
        ?password-toggle=${this.type === 'password'}
        class="base"
        size=${this.size}
        ${ref(this._slInputRef)}
        value=${this.value}
        ?autofocus=${this.autofocus}
        @keydown=${this._onKeyDown}
        @blur=${this._onBlur}
        ?required=${this.required}
        label=${this.label}
        autocomplete=${this.autocomplete}
        exportparts="base,form-control,form-control-label,form-control-input,form-control-help-text"
      >
        ${when(
          icon,
          () =>
            html`
              <sl-icon
                slot="suffix"
                library="shoelace-widgets"
                name=${icon}
              ></sl-icon>
            `
        )}
      </sl-input>
    `;
  }

  checkValidity(): boolean {
    return this._slInputRef.value!.checkValidity();
  }

  reportValidity(): boolean {
    const ret = this._slInputRef.value!.reportValidity();

    this._formFieldCtrl.updateValidity();

    if (!ret) {
      this.setAttribute('data-user-invalid', ''); // TODO!!!!!!!!!!!!!!!!!!!!!!
    }

    return ret;
  }

  get validity() {
    return this._slInputRef.value!.validity;
  }

  get validationMessage() {
    return this._slInputRef.value!.validationMessage;
  }
}
