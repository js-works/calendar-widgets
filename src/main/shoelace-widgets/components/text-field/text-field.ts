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
  }

  private _onKeyDown = (ev: KeyboardEvent) => {
    void (ev.key === 'Enter' && this._formFieldCtrl.submit());
  };

  private _onBlur = () => {
    this._formFieldCtrl.suppressError(false);
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
        type=${this.type === 'password' ? 'password' : 'text'}
        ?password-toggle=${this.type === 'password'}
        class="sl-control"
        size=${this.size}
        ${ref(this._slInputRef)}
        value=${this.value}
        ?autofocus=${this.autofocus}
        @keydown=${this._onKeyDown}
        @blur=${this._onBlur}
        ?required=${this.required}
        label=${this.label}
        exportparts="form-control,form-control-label,form-control-input"
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
    return this._slInputRef.value?.checkValidity() || false;
  }

  reportValidity(): boolean {
    return this._slInputRef.value?.reportValidity() || false;
  }
}
