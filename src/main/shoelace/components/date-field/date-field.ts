import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { when } from 'lit/directives/when';
import { createRef, ref } from 'lit/directives/ref';
import { LocalizeController } from '@shoelace-style/localize';
import { dateAttributeConverter } from '../../utils/attribute-converters';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
import { DatePicker } from '../date-picker/date-picker';

import {
  FormFieldController,
  Validators
} from '../../controllers/form-field-controller';

// styles
import dateFieldStyles from './date-field.styles';

// icons
import dateIcon from '../../icons/bootstrap/calendar3.icon';
import datesIcon from '../../icons/bootstrap/calendar3.icon';
import timeIcon from '../../icons/bootstrap/clock.icon';
import dateTimeIcon from '../../icons/bootstrap/calendar3.icon';
import dateRangeIcon from '../../icons/bootstrap//calendar-range.icon';
import weekIcon from '../../icons/bootstrap/calendar.icon';
import monthIcon from '../../icons/bootstrap/calendar.icon';
import yearIcon from '../../icons/bootstrap/calendar.icon';

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-date-field': DateField;
  }
}

// === DateField =====================================================

// dependencies (to prevent to much tree shaking)
void DatePicker || SlDropdown || SlIcon || SlIconButton || SlInput;

@customElement('sx-date-field')
export class DateField extends LitElement {
  static styles = dateFieldStyles;

  @property({ type: String, attribute: 'selection-mode' })
  selectionMode: 'date' | 'dateTime' | 'dateRange' | 'time' = 'date';

  @property()
  name = '';

  @property()
  value = '';

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ attribute: false })
  selection: Date[] = [];

  @property({ type: Boolean, attribute: 'show-week-numbers' })
  showWeekNumbers = false;

  @property({ type: String, attribute: 'days-amount' })
  daysAmount: 'default' | 'minimal' | 'maximal' = 'default';

  @property({ type: Boolean, attribute: 'highlight-weekends' })
  highlightWeekends = false;

  @property({ type: Boolean, attribute: 'disable-weekends' })
  disableWeekends = false;

  @property({ converter: dateAttributeConverter, attribute: 'min-date' })
  minDate: Date | null = null;

  @property({ converter: dateAttributeConverter, attribute: 'max-date' })
  maxDate: Date | null = null;

  @state()
  private _value = '';

  private _pickerRef = createRef<DatePicker>();
  private _dropdownRef = createRef<SlDropdown>();
  private _inputRef = createRef<SlInput>();
  private _localize = new LocalizeController(this);

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,

    validation: [Validators.required((value) => !this.required || !!value)]
  });

  private _onInputClick() {
    this._inputRef.value!.focus();
  }

  private _onOkClick = () => {
    this._value = this._pickerRef.value!.value;
    this._dropdownRef.value!.hide();
  };

  private _onInputKeyDown = (ev: KeyboardEvent) => {
    if (ev.key !== 'ArrowDown' || this._dropdownRef.value!.open) {
      return;
    }

    this._dropdownRef.value!.show();
  };

  private _onCancelClick = () => {
    this._dropdownRef.value!.hide();
  };

  private _onClearClick = () => {
    this._value = '';
    this._dropdownRef.value!.hide();
  };

  get validationMessage(): string {
    return this._formField.validate() || '';
  }

  focus() {
    this._inputRef.value!.focus();
  }

  blur(): void {
    this._inputRef.value?.blur();
  }

  render() {
    const icon = {
      date: dateIcon,
      dates: datesIcon,
      dateRange: dateRangeIcon,
      dateTime: dateTimeIcon,
      time: timeIcon,
      week: weekIcon,
      month: monthIcon,
      year: yearIcon
    }[this.selectionMode];

    return html`
      <div
        class=${classMap({
          base: true,
          required: this.required,
          invalid: this._formField.showsError()
        })}
      >
        <sl-dropdown
          class="dropdown"
          placement="bottom-center"
          distance=${2}
          skidding=${2}
          .containingElement=${this}
          hoist
          ${ref(this._dropdownRef)}
        >
          <sl-input
            slot="trigger"
            value=${this._value}
            ?disabled=${this.disabled}
            readonly
            @click=${this._onInputClick}
            @keydown=${this._onInputKeyDown}
            size=${this.size}
            ${ref(this._inputRef)}
            class=${classMap({
              'sl-control': true,
              'input': true,
              'input--disabled': this.disabled
            })}
          >
            <sl-icon slot="suffix" class="calendar-icon" src=${icon}></sl-icon>
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
          <div class="popup-content">
            <div class="popup-header">
              <sl-icon src=${icon}></sl-icon>
              Mon, Nov 21, 2022
            </div>
            <sx-date-picker
              class="date-picker"
              .selectionMode=${this.selectionMode}
              .daysAmount=${this.daysAmount}
              .showWeekNumbers=${this.showWeekNumbers}
              .highlightWeekends=${this.highlightWeekends}
              .disableWeekends=${this.disableWeekends}
              .minDate=${this.minDate}
              .maxDate=${this.minDate}
              ${ref(this._pickerRef)}
            >
            </sx-date-picker>
            <div class="popup-footer">
              <sl-button
                variant="text"
                class="button"
                @click=${this._onClearClick}
                >Clear</sl-button
              >
              <sl-button
                variant="text"
                class="button"
                @click=${this._onCancelClick}
              >
                Cancel
              </sl-button>
              <sl-button
                variant="text"
                class="button"
                @click=${this._onOkClick}
              >
                OK
              </sl-button>
            </div>
          </div>
        </sl-dropdown>
        ${when(this._formField.getValidationMode() === 'inline', () =>
          this._formField.renderErrorMsg()
        )}
      </div>
    `;
  }
}
