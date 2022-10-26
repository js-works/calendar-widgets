import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { when } from 'lit/directives/when';
import { createRef, ref } from 'lit/directives/ref';
import { LocalizeController } from '../../i18n/i18n';

import {
  FormFieldController,
  Validators
} from '../../controllers/form-field-controller';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// icons
import emailIcon from '../../icons/bootstrap/email.icon';
import phoneIcon from '../../icons/bootstrap/phone.icon';
import telephoneIcon from '../../icons/bootstrap/telephone.icon';

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
class TextField extends LitElement {
  static styles = textFieldStyles;

  static {
    // dependencies (to prevent too much tree shaking)
    void [SlIcon, SlInput];
  }

  @property()
  type: 'text' | 'password' | 'email' | 'phone' | 'telephone' = 'text';

  @property()
  name = '';

  @property()
  value = '';

  @property()
  label = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  private _slInputRef = createRef<SlInput>();
  private _localize = new LocalizeController(this);

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,
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

  get validationMessage(): string {
    return this._formField.validate() || '';
  }

  private _onInput = () => this._formField.signalInput();
  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formField.signalSubmit());

  render() {
    const icon =
      this.type === 'email'
        ? emailIcon
        : this.type === 'phone'
        ? phoneIcon
        : this.type === 'telephone'
        ? telephoneIcon
        : null;

    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError()
        })}"
      >
        <sl-input
          type=${this.type === 'password' ? 'password' : 'text'}
          ?password-toggle=${this.type === 'password'}
          class="sl-control"
          size=${this.size}
          ${ref(this._slInputRef)}
          value=${this.value}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          ${when(
            this.label,
            () => html`
              <span
                slot="label"
                class=${classMap({
                  'sl-control-label': true,
                  'sl-control-label--required': this.required
                })}
              >
                ${this.label}
              </span>
            `
          )}
          ${when(
            icon,
            () => html`<sl-icon slot="suffix" src=${icon}></sl-icon> `
          )}
        </sl-input>
        ${this._formField.renderErrorMsg()}
      </div>
    `;
  }
}
