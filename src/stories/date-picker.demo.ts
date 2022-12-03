import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import SlCard from '@shoelace-style/shoelace/dist/components/card/card';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

import { DatePicker } from '../main/shoelace-widgets';
import { DateField } from '../main/shoelace-widgets';

export default {
  title: 'shoelace-widgets'
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
    width: 21rem;
  }

  .picker {
    display: block;
    border: 1px solid var(--sl-color-primary-100);
    box-shadow: var(--sl-shadow-large);
    width: 21rem;
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
`;

@customElement('date-picker-demo')
class DatePickerDemo extends LitElement {
  static {
    // dependencies (to prevent too much tree shaking)
    void [DateField, DatePicker, SlCard, SlCheckbox, SlMenuItem, SlSelect];
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
            calendar-size=${this._calendarSize}
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
            <sl-menu-item value="en-US">en-US</sl-menu-item>
            <sl-menu-item value="en-GB">en-GB</sl-menu-item>
            <sl-menu-item value="en-GB-u-hc-h12">en-GB-u-hc-h12</sl-menu-item>
            <sl-menu-item value="es-ES">es-ES</sl-menu-item>
            <sl-menu-item value="fr-FR">fr-FR</sl-menu-item>
            <sl-menu-item value="de-DE">de-DE</sl-menu-item>
            <sl-menu-item value="de-AT">de-AT</sl-menu-item>
            <sl-menu-item value="de-CH">de-CH</sl-menu-item>
            <sl-menu-item value="it-IT">it-IT</sl-menu-item>
            <sl-menu-item value="ar-SA">ar-SA</sl-menu-item>
          </sl-select>
          <sl-select
            class="mode-selector"
            data-subject="selectionMode"
            label="Selection mode"
            value=${this._selectionMode}
          >
            <sl-menu-item value="date">date</sl-menu-item>
            <sl-menu-item value="dates">dates</sl-menu-item>
            <sl-menu-item value="dateTime">dateTime</sl-menu-item>
            <sl-menu-item value="dateRange">dateRange</sl-menu-item>
            <sl-menu-item value="dateTimeRange">dateTimeRange</sl-menu-item>
            <sl-menu-item value="time">time</sl-menu-item>
            <sl-menu-item value="timeRange">timeRange</sl-menu-item>
            <sl-menu-item value="week">week</sl-menu-item>
            <sl-menu-item value="weeks">weeks</sl-menu-item>
            <sl-menu-item value="month">month</sl-menu-item>
            <sl-menu-item value="months">months</sl-menu-item>
            <sl-menu-item value="monthRange">monthRange</sl-menu-item>
            <sl-menu-item value="quarter">quarter</sl-menu-item>
            <sl-menu-item value="quarters">quarters</sl-menu-item>
            <sl-menu-item value="quarterRange">quarterRange</sl-menu-item>
            <sl-menu-item value="year">year</sl-menu-item>
            <sl-menu-item value="years">years</sl-menu-item>
            <sl-menu-item value="yearRange">yearRange</sl-menu-item>
          </sl-select>
          <sl-select
            label="Calendar size"
            data-subject="calendarSize"
            value=${this._calendarSize}
          >
            <sl-menu-item value="default">
              default (with adjacent days)
            </sl-menu-item>
            <sl-menu-item value="minimal">
              minimal (without adjacent days)
            </sl-menu-item>
            <sl-menu-item value="maximal">
              maximal (always 42 days)
            </sl-menu-item>
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
              <sl-checkbox
                data-subject="enableCenturyView"
                ?checked=${this._enableCenturyView}
              >
                enable century view
              </sl-checkbox>
              <sx-date-field label="Min. date" data-subject="minDate">
              </sx-date-field>
              <sx-date-field label="Max. date" data-subject="maxDate">
              </sx-date-field>
            `
          )}
        </div>
      </div>
    `;
  }
}
