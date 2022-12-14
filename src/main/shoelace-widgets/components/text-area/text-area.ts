import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LocalizeController } from '../../i18n/i18n';

import {
  FormFieldController,
  Validators
} from '../../form-fields/__form-field-controller';

// custom elements
import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea';

// styles
import textFieldStyles from './text-area.styles';

// === exports =======================================================

export { TextArea };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-text-area': TextArea;
  }
}

// === TextArea ======================================================

@customElement('sx-text-area')
class TextArea extends LitElement {
  static styles = textFieldStyles;

  static {
    // dependencies (to prevent too much tree shaking)
    void [SlTextarea];
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

  @property({ type: Number })
  rows = 4;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  private _slTextareaRef = createRef<SlTextarea>();

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,
    validation: [Validators.required((value) => !this.required || !!value)]
  });

  focus() {
    this._slTextareaRef.value!.focus();
  }

  blur(): void {
    this._slTextareaRef.value?.blur();
  }

  protected override firstUpdated() {
    Object.defineProperty(this, 'value', {
      get: () => this._slTextareaRef.value!.value,
      set: (value: string) => void (this._slTextareaRef.value!.value = value)
    });
  }

  get validationMessage(): string {
    return this._formField.validate() || '';
  }

  private _onInput = () => this._formField.signalInput();
  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  render() {
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError()
        })}"
      >
        <sl-textarea
          class="sl-control"
          ${ref(this._slTextareaRef)}
          value=${this.value}
          rows=${this.rows}
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
        </sl-textarea>
        ${this._formField.renderErrorMsg()}
      </div>
    `;
  }
}
