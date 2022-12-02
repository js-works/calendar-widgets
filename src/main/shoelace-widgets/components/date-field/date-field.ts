import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
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
} from '../../form-fields/form-field-controller';

// styles
import dateFieldStyles from './date-field.styles';

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
  selectionMode:
    | 'date'
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'dateTimeRange'
    | 'timeRange'
    | 'week'
    | 'month'
    | 'year' = 'date';

  @property()
  name = '';

  @property()
  get value(): string {
    return this._value;
  }

  set value(value: string) {
    // TODO!!!!
    this._value = value;
  }

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

  @property({ type: String, attribute: 'calendar-size' })
  calendarSize: 'default' | 'minimal' | 'maximal' = 'default';

  @property({ type: Boolean, attribute: 'highlight-weekends' })
  highlightWeekends = false;

  @property({ type: Boolean, attribute: 'disable-weekends' })
  disableWeekends = false;

  @property({ type: Boolean, attribute: 'enable-century-view' })
  enableCenturyView = false;

  @property({ converter: dateAttributeConverter, attribute: 'min-date' })
  minDate: Date | null = null;

  @property({ converter: dateAttributeConverter, attribute: 'max-date' })
  maxDate: Date | null = null;

  @property({ attribute: false })
  format: Intl.DateTimeFormatOptions | null = null;

  @property()
  lang = '';

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

  private _acceptSelection() {
    this.value = this._pickerRef.value!.value;
    this._dropdownRef.value!.hide();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private _getPopupTitle() {
    return logicBySelectionMode[this.selectionMode].getPopupTitle(
      this._pickerRef.value?.value || '',
      this._localize
    );
  }

  private _onInputClick() {
    this._inputRef.value!.focus();
  }

  private _onOkClick = () => {
    this._acceptSelection();
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
    this.value = '';
    this._dropdownRef.value!.hide();
    this._pickerRef.value!.value = '';
  };

  private _onPickerChange = (ev: Event) => {
    ev.stopPropagation();
    this.requestUpdate();
  };

  private _onClosePopupClick = () => {
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
    const icon =
      'date-field.' +
      {
        date: 'date',
        dateTime: 'date-time',
        dateRange: 'date-range',
        dateTimeRange: 'date-time-range',
        time: 'time',
        timeRange: 'time-range',
        week: 'week',
        month: 'month',
        year: 'year'
      }[this.selectionMode];

    let value = '';

    if (this.selectionMode !== 'week' && this.format) {
      if (this._value) {
        value = this._localize.date(this._value, this.format);
      }
    } else {
      value = logicBySelectionMode[this.selectionMode].formatValue(
        this._value,
        this._localize
      );
    }

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
          @sl-after-hide=${() => this._pickerRef.value?.resetView()}
        >
          <sl-input
            slot="trigger"
            value=${value}
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
            <sl-icon
              slot="suffix"
              class="calendar-icon"
              library="shoelace-widgets"
              name=${icon}
            ></sl-icon>
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
              <sl-icon library="shoelace-widgets" name=${icon}></sl-icon>
              <div class="popup-title">${this._getPopupTitle()}</div>
              <sl-icon-button
                class="popup-close-button"
                library="system"
                name="x"
                @click=${this._onClosePopupClick}
              ></sl-icon-button>
            </div>
            <sx-date-picker
              class="date-picker"
              value=${this.value}
              selection-mode=${this.selectionMode}
              calendar-size=${this.calendarSize}
              ?show-week-numbers=${this.showWeekNumbers}
              ?highlight-weekends=${this.highlightWeekends}
              ?disable-weekends=${this.disableWeekends}
              ?enable-century-view=${this.enableCenturyView}
              .minDate=${this.minDate}
              .maxDate=${this.minDate}
              lang=${this._localize.lang()}
              dir=${this._localize.dir()}
              ${ref(this._pickerRef)}
              @change=${this._onPickerChange}
            >
            </sx-date-picker>
            <div class="popup-footer">
              <sl-button
                variant="text"
                class="button"
                @click=${this._onClearClick}
              >
                Clear
              </sl-button>
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

const logicBySelectionMode: Record<
  DateField['selectionMode'],
  {
    formatValue(value: string, localize: LocalizeController): string;
    getPopupTitle(value: string, localize: LocalizeController): string;
  }
> = {
  date: {
    formatValue(value, localize) {
      if (!value) {
        return '';
      }

      return localize.date(value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    getPopupTitle(value, locale) {
      if (!value) {
        return '';
      }

      return locale.date(value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  },

  dateRange: {
    formatValue(value, localize) {
      return logicBySelectionMode['dateRange'].getPopupTitle(value, localize);
    },

    getPopupTitle(value, localize) {
      if (!value) {
        return '';
      }

      const dates = value.split(',').map((it) => new Date(it));

      const ret = new Intl.DateTimeFormat(localize.lang(), {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).formatRange(dates[0], dates[dates.length - 1]);

      return ret;
    }
  },

  dateTime: {
    formatValue(value, localize) {
      if (!value) {
        return '';
      }

      return localize.date(value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    },

    getPopupTitle(value, localize) {
      if (!value) {
        return '';
      }

      return localize.date(value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    }
  },

  dateTimeRange: {
    formatValue(value, localize) {
      if (!value) {
        return '';
      }

      const dates = value.split(',').map((it) => new Date(it));

      if (dates.length < 2) {
        dates.push(dates[0]);
      }

      return new Intl.DateTimeFormat(localize.lang(), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).formatRange(dates[0], dates[1]);
    },

    getPopupTitle(value, localize) {
      if (!value) {
        return '';
      }

      const dates = value.split(',').map((it) => new Date(it));

      if (dates.length < 2) {
        dates.push(dates[0]);
      }

      return new Intl.DateTimeFormat(localize.lang(), {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).formatRange(dates[0], dates[1]);
    }
  },

  time: {
    formatValue(value, localize) {
      if (!value) {
        return '';
      }

      const date = new Date();
      const timeTokens = value.split(':');
      date.setHours(parseInt(timeTokens[0], 10));
      date.setMinutes(parseInt(timeTokens[1], 10));
      date.setSeconds(0);
      date.setMilliseconds(0);

      return localize.date(date, {
        hour: 'numeric',
        minute: 'numeric'
      });
    },

    getPopupTitle() {
      return '';
    }
  },

  timeRange: {
    formatValue(value, localize) {
      if (!value) {
        return '';
      }

      const values = value.split(',');
      const dates: Date[] = [];

      for (let i = 0; i < 2; ++i) {
        const date = new Date();
        const [hours, minutes] = values[i].split(':');
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(0);
        date.setMilliseconds(0);
        dates.push(date);
      }

      const ret = new Intl.DateTimeFormat(localize.lang(), {
        hour: 'numeric',
        minute: 'numeric'
      }).formatRange(dates[0], dates[1]);

      return ret;
    },

    getPopupTitle(value, localize) {
      return logicBySelectionMode.timeRange.formatValue(value, localize);
    }
  },

  week: {
    formatValue(value) {
      if (!value) {
        return '';
      }

      return value.replace('-W', '/');
    },

    getPopupTitle(value) {
      if (!value) {
        return '';
      }

      return value.replace('-W', '/');
    }
  },

  month: {
    formatValue(value, localizer) {
      if (!value) {
        return '';
      }

      return localizer.date(value, {
        year: 'numeric',
        month: 'long'
      });
    },

    getPopupTitle(value, localizer) {
      if (!value) {
        return '';
      }

      return localizer.date(value, {
        year: 'numeric',
        month: 'long'
      });
    }
  },

  year: {
    formatValue(value) {
      return value;
    },

    getPopupTitle(value) {
      return value;
    }
  }
};
