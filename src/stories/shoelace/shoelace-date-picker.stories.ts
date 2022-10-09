import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { when } from 'lit/directives/when';
import SlCard from '@shoelace-style/shoelace/dist/components/card/card';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

import { DatePicker } from '../../main/calendar-widgets-shoelace';
import { DateField } from '../../main/calendar-widgets-shoelace';
import '../../../node_modules/@shoelace-style/shoelace/dist/themes/light.css';

export default {
  title: 'Shoelace'
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
    width: 20rem;
  }

  .second-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mode-selector {
    min-width: 12rem;
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
  private _selectionMode = 'dateTime';
  private _elevateNavigation = true;
  private _highlightToday = true;
  private _highlightWeekends = true;
  private _disableWeekends = false;
  private _showWeekNumbers = true;
  private _showAdjacentDays = true;
  private _enableCenturyView = false;
  private _fixedDayCount = false;

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
            ?elevate-navigation=${this._elevateNavigation}
            ?highlight-today=${this._highlightToday}
            ?highlight-weekends=${this._highlightWeekends}
            ?disable-weekends=${this._disableWeekends}
            ?show-week-numbers=${this._showWeekNumbers}
            ?show-adjacent-days=${this._showAdjacentDays}
            ?enable-century-view=${this._enableCenturyView}
            ?fixed-day-count=${this._fixedDayCount}
            lang=${this._locale}
            dir=${this._locale === 'ar-SA' ? 'rtl' : 'ltr'}
          ></sx-date-picker>
          <div>Selection:</div>
          <div>${this._selectionValue.replaceAll(',', ', ')}</div>
        </div>
        <div class="second-column">
          <sl-select label="Locale" data-subject="locale" value=${this._locale}>
            <sl-menu-item value="en-US">en-US</sl-menu-item>
            <sl-menu-item value="en-GB">en-GB</sl-menu-item>
            <sl-menu-item value="es-ES">es-ES</sl-menu-item>
            <sl-menu-item value="fr-FR">fr-FR</sl-menu-item>
            <sl-menu-item value="de-DE">de-DE</sl-menu-item>
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
            <sl-menu-item value="dateRange">dateRange</sl-menu-item>
            <sl-menu-item value="dateTime">dateTime</sl-menu-item>
            <sl-menu-item value="time">time</sl-menu-item>
            <sl-menu-item value="week">week</sl-menu-item>
            <sl-menu-item value="weeks">weeks</sl-menu-item>
            <sl-menu-item value="month">month</sl-menu-item>
            <sl-menu-item value="months">months</sl-menu-item>
            <sl-menu-item value="year">year</sl-menu-item>
            <sl-menu-item value="years">years</sl-menu-item>
          </sl-select>
          ${when(
            [
              'date',
              'dates',
              'dateRange',
              'dateTime',
              'week',
              'weeks'
            ].includes(this._selectionMode),
            () => html`
              <sl-checkbox
                data-subject="elevateNavigation"
                ?checked=${this._elevateNavigation}
              >
                elevate navigation
              </sl-checkbox>
              <sl-checkbox
                data-subject="showAdjacentDays"
                ?checked=${this._showAdjacentDays}
              >
                show adjacent days
              </sl-checkbox>
              <sl-checkbox
                data-subject="highlightToday"
                ?checked=${this._highlightToday}
              >
                highlight today
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
              <sl-checkbox
                data-subject="fixedDayCount"
                ?checked=${this._fixedDayCount}
              >
                fixed day count
              </sl-checkbox>
              <sx-date-field
                label="Min. date"
                show-adjacent-days
                show-week-numbers
              >
              </sx-date-field>
              <sx-date-field
                label="Max. date"
                show-adjacent-days
                show-week-numbers
              >
              </sx-date-field>
            `
          )}
        </div>
      </div>
    `;
  }
}
