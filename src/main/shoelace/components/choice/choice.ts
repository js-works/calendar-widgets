import { html, LitElement, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { createRef, ref } from 'lit/directives/ref';
import { LocalizeController } from '../../i18n/i18n';

import {
  FormFieldController,
  Validators
} from '../../controllers/form-field-controller';

// custom elements
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';
import SlRadio from '@shoelace-style/shoelace/dist/components/radio/radio';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group';

// styles
import choiceStyles from './choice.styles';

// === exports =======================================================

export { Choice };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-choice': Choice;
  }
}

declare namespace Choice {
  export type Option = {
    text: string;
    value: string;
  };
}

// === Choice ========================================================

@customElement('sx-choice')
class Choice extends LitElement {
  static styles = choiceStyles;

  static {
    // dependencies (to prevent too much tree shaking)
    void [SlSelect, SlMenuItem, SlRadio, SlRadioGroup];
  }

  @property()
  name = '';

  @property()
  value = '';

  @property()
  label = '';

  @property()
  type: 'select' | 'radios' | 'horizontal-radios' = 'select';

  @property({ attribute: false })
  options: Choice.Option[] = [];

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  private _localize = new LocalizeController(this);

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,

    validation: [Validators.required((value) => !this.required || !!value)]
  });

  get validationMessage(): string {
    return this._formField.validate() || '';
  }

  private _onInput = () => this._formField.signalInput();

  private _onChange = (ev: any) => {
    this.value = ev.target.value;
    this._formField.signalChange();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      ev.stopPropagation(); // TODO!!!!
    }

    if (ev.key === 'Enter') {
      this._formField.signalSubmit();
    }
  };

  render() {
    const type = ['radios', 'horizontal-radios'].includes(this.type)
      ? this.type
      : 'select';

    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError(),
          [type]: true
        })}"
      >
        ${when(
          type !== 'radios' && type !== 'horizontal-radios',
          () => html`
            <sl-select
              class="sl-control"
              hoist
              @sl-change=${this._onChange}
              @keydown=${this._onKeyDown}
              value=${this.value}
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

              ${repeat(
                this.options,
                (option) => html`
                  <sl-menu-item value=${option.value}
                    >${option.text}</sl-menu-item
                  >
                `
              )}
            </sl-select>
          `
        )}
        ${when(
          this.type === 'radios' || this.type === 'horizontal-radios',
          () => html`
            <div class="form-control">
              <div
                class=${classMap({
                  'form-control-label': true,
                  'form-control-label--required': this.required
                })}
              >
                ${this.label}
              </div>
              <div class="form-control-input">
                ${repeat(
                  this.options,
                  (option) => html`
                    <sl-radio value=${option.value}>${option.text}</sl-radio>
                  `
                )}
              </div>
            </div>
          `
        )}
        ${when(this._formField.getValidationMode() === 'inline', () =>
          this._formField.renderErrorMsg()
        )}
      </div>
    `;
  }
}
