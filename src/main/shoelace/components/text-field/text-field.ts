import { html, LitElement, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { createRef, ref } from 'lit/directives/ref';
import { when } from 'lit/directives/when';

import { LocalizeController } from '../../i18n/i18n';
import { FormFieldController } from '../../controllers/form-field-controller';
import { FieldCheckers, FieldValidator } from '../../misc/form-validation';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

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

class TextField extends LitElement {
  static styles = textFieldStyles;

  static {
    // dependencies (to prevent too much tree shaking)
    void [SlInput];
  }

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

  private _fieldValidator = new FieldValidator(
    () => this.value,
    () => this._localize.lang(),
    [FieldCheckers.required((value) => !this.required || !!value)]
  );

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,
    validate: () => this._fieldValidator.validate()
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
    return this._fieldValidator.validate() || '';
  }

  private _onInput = () => this._formField.signalInput();
  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formField.signalSubmit());

  render() {
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError()
        })}"
      >
        <sl-input
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
          <span
            slot="label"
            class=${classMap({
              'sl-control-label': true,
              'sl-control-label--required': this.required
            })}
          >
            ${this.label}
          </span>
        </sl-input>
        ${this._formField.renderErrorMsg()}
      </div>
    `;
  }
}
