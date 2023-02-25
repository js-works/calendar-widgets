import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import SlCard from '@shoelace-style/shoelace/dist/components/card/card';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlOption from '@shoelace-style/shoelace/dist/components/option/option';

import { DatePicker } from '../main/shoelace-elements';
import { DateField } from '../main/shoelace-elements';

export default {
  title: 'shoelace-elements'
};

export const datePicker = () => '<date-picker-demo></date-picker-demo>';

const styles = css`
  .columns {
    display: flex;
    gap: 2rem;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
  }

  .first-column {
    width: 24rem;
  }

  .picker {
    display: block;
    border: 1px solid var(--sl-color-primary-100);
    box-shadow: var(--sl-shadow-large);
    width: 24rem;
  }

  .selection {
    margin-top: 1rem;
  }

  .second-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mode-selector {
    min-width: 18rem;
  }

  .date-range {
    display: grid;
    grid-template-columns: 12rem 12rem;
    gap: 1rem;
  }
`;

@customElement('date-picker-demo')
class DatePickerDemo extends LitElement {
  static {
    // dependencies (to prevent too much tree shaking)
    void [DateField, DatePicker, SlCard, SlCheckbox, SlOption, SlSelect];
  }

  static styles = styles;

  private _locale = 'en-US';
  private _selectionValue: string = '';
  private _selectionMode = 'date';
  private _accentuateHeader = true;
  private _highlightCurrent = true;
  private _highlightWeekends = true;
  private _disableWeekends = false;
  private _showWeekNumbers = true;
  private _calendarSize: 'default' | 'minimal' | 'maximal' = 'default';
  private _enableCenturyView = false;
  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;

  private _onChange = (ev: Event) => {
    const target: any = ev.target;
    const subject = target.getAttribute('data-subject');

    if (!subject) {
      return;
    }

    if (subject === 'locale') {
      this._locale = target.value;
    } else if (subject === 'datePicker') {
      this._selectionValue = target.value;
    } else if (subject === 'selectionMode') {
      this._selectionMode = target.value;
    } else if (subject === 'calendarSize') {
      this._calendarSize = target.value;
    } else if (subject === 'minDate') {
      this._minDate = target.value ? new Date(target.value) : null;
    } else if (subject === 'maxDate') {
      this._maxDate = target.value ? new Date(target.value) : null;
    } else {
      Object.assign(this, {
        [`_${subject}`]: target.checked
      });
    }

    this.requestUpdate();
  };

  render() {
    return html`
      <div
        class="columns"
        @change=${this._onChange}
        @sl-change=${this._onChange}
      >
        <div class="first-column">
          <sx-date-picker
            data-subject="datePicker"
            selection-mode=${this._selectionMode}
            .calendarSize=${this._calendarSize}
            ?accentuate-header=${this._accentuateHeader}
            ?highlight-current=${this._highlightCurrent}
            ?highlight-weekends=${this._highlightWeekends}
            ?disable-weekends=${this._disableWeekends}
            ?show-week-numbers=${this._showWeekNumbers}
            ?enable-century-view=${this._enableCenturyView}
            lang=${this._locale}
            dir=${this._locale === 'ar-SA' ? 'rtl' : 'ltr'}
            .minDate=${this._minDate}
            .maxDate=${this._maxDate}
            class="picker"
          ></sx-date-picker>
          <div class="selection">
            <div>Selection:</div>
            <div>${this._selectionValue.replaceAll(',', ', ')}</div>
          </div>
        </div>
        <div class="second-column">
          <sl-select label="Locale" data-subject="locale" value=${this._locale}>
            <sl-option value="en-US">en-US</sl-option>
            <sl-option value="en-GB">en-GB</sl-option>
            <sl-option value="en-GB-u-hc-h12">en-GB-u-hc-h12</sl-option>
            <sl-option value="es-ES">es-ES</sl-option>
            <sl-option value="fr-FR">fr-FR</sl-option>
            <sl-option value="de-DE">de-DE</sl-option>
            <sl-option value="de-AT">de-AT</sl-option>
            <sl-option value="de-CH">de-CH</sl-option>
            <sl-option value="it-IT">it-IT</sl-option>
            <sl-option value="ar-SA">ar-SA</sl-option>
          </sl-select>
          <sl-select
            class="mode-selector"
            data-subject="selectionMode"
            label="Selection mode"
            value=${this._selectionMode}
          >
            <sl-option value="date">date</sl-option>
            <sl-option value="dates">dates</sl-option>
            <sl-option value="dateTime">dateTime</sl-option>
            <sl-option value="dateRange">dateRange</sl-option>
            <sl-option value="dateTimeRange">dateTimeRange</sl-option>
            <sl-option value="time">time</sl-option>
            <sl-option value="timeRange">timeRange</sl-option>
            <sl-option value="week">week</sl-option>
            <sl-option value="weeks">weeks</sl-option>
            <sl-option value="weekRange">weekRange</sl-option>
            <sl-option value="month">month</sl-option>
            <sl-option value="months">months</sl-option>
            <sl-option value="monthRange">monthRange</sl-option>
            <sl-option value="quarter">quarter</sl-option>
            <sl-option value="quarters">quarters</sl-option>
            <sl-option value="quarterRange">quarterRange</sl-option>
            <sl-option value="year">year</sl-option>
            <sl-option value="years">years</sl-option>
            <sl-option value="yearRange">yearRange</sl-option>
          </sl-select>
          <sl-select
            label="Calendar size"
            data-subject="calendarSize"
            value=${this._calendarSize}
          >
            <sl-option value="default">
              default (show adjacent days/years/decades)
            </sl-option>
            <sl-option value="minimal">
              minimal (hide adjacent days/years/decades)
            </sl-option>
            <sl-option value="maximal">
              maximal (always show 42 days in month view)
            </sl-option>
          </sl-select>
          <sl-checkbox
            data-subject="accentuateHeader"
            ?checked=${this._accentuateHeader}
          >
            accentuate header
          </sl-checkbox>
          ${when(
            [
              'date',
              'dates',
              'dateTime',
              'dateRange',
              'dateTimeRange',
              'week',
              'weeks'
            ].includes(this._selectionMode),
            () => html`
              <sl-checkbox
                data-subject="highlightCurrent"
                ?checked=${this._highlightCurrent}
              >
                highlight current
              </sl-checkbox>
              <sl-checkbox
                data-subject="highlightWeekends"
                ?checked=${this._highlightWeekends}
              >
                highlight weekends
              </sl-checkbox>
              <sl-checkbox
                data-subject="disableWeekends"
                ?checked=${this._disableWeekends}
              >
                disable weekends
              </sl-checkbox>
              <sl-checkbox
                data-subject="showWeekNumbers"
                ?checked=${this._showWeekNumbers}
              >
                show week numbers
              </sl-checkbox>
            `
          )}
          <sl-checkbox
            data-subject="enableCenturyView"
            ?checked=${this._enableCenturyView}
          >
            enable century view
          </sl-checkbox>
          <div class="date-range">
            <sx-date-field label="Min. date" data-subject="minDate">
            </sx-date-field>
            <sx-date-field label="Max. date" data-subject="maxDate">
            </sx-date-field>
          </div>
        </div>
      </div>
    `;
  }
}
