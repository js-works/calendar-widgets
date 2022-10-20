import { html, LitElement, PropertyValueMap } from 'lit';
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
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

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

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,

    validation: [Validators.required((value) => !this.required || !!value)]
  });

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
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError()
        })}"
      >
        <sl-select class="sl-control">
          <span
            slot="label"
            class=${classMap({
              'sl-control-label': true,
              'sl-control-label--required': this.required
            })}
          >
            ${this.label}
          </span>
          <sl-menu-item>Option 1</sl-menu-item>
          <sl-menu-item>Option 2</sl-menu-item>
          <sl-menu-item>Option 3</sl-menu-item>
        </sl-select>
        ${this._formField.renderErrorMsg()}
      </div>
    `;
  }
}
