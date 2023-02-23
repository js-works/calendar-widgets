import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DateField } from '../main/shoelace-widgets/components/date-field/date-field';
import { Fieldset } from '../main/shoelace-widgets/components/fieldset/fieldset';

export default {
  title: 'shoelace-widgets'
};

export const dateFields = () => '<date-field-demo></date-field-demo>';

const styles = css`
  .base {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
  }

  .locale-selector {
    display: inline-block;
    width: 10em;
  }

  sx-date-field {
    width: 15em;
  }

  .columns {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 3em;
  }
`;

@customElement('date-field-demo')
class DatePickerDemo extends LitElement {
  static styles = styles;

  static {
    // dependencies (to prevent to much tree shaking)
    void [DateField, Fieldset];
  }

  @property()
  lang = '';

  @property()
  dir = '';

  @state()
  private _locale = 'en-US';

  private _onChange = (ev: Event) => {
    this._locale = (ev.target as any).value;
    this.requestUpdate();
  };

  render() {
    return html`
      <sx-fieldset label-layout="horizontal" class="base">
        <sl-select
          label="Locale"
          value=${this._locale}
          @sl-change=${this._onChange}
          class="locale-selector"
        >
          <sl-option value="en-US">en-US</sl-option>
          <sl-option value="en-GB">en-GB</sl-option>
          <sl-option value="es">es</sl-option>
          <sl-option value="fr">fr</sl-option>
          <sl-option value="de">de</sl-option>
          <sl-option value="it">it</sl-option>
        </sl-select>
        <br />
        <div class="columns">
          <sx-date-field
            label="Date"
            show-week-numbers
            highlight-current
            highlight-weekends
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Date and time"
            selection-mode="dateTime"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Date range"
            selection-mode="dateRange"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Date time range"
            selection-mode="dateTimeRange"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Time"
            selection-mode="time"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Time range"
            selection-mode="timeRange"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Week"
            selection-mode="week"
            show-week-numbers
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Week range"
            selection-mode="weekRange"
            show-week-numbers
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Month"
            selection-mode="month"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Month range"
            selection-mode="monthRange"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Quarter"
            selection-mode="quarter"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Quarter range"
            selection-mode="quarterRange"
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Year"
            selection-mode="year"
            enable-century-view
            lang=${this._locale}
          ></sx-date-field>
          <sx-date-field
            label="Year range"
            selection-mode="yearRange"
            enable-century-view
            lang=${this._locale}
          ></sx-date-field>
        </div>
      </sx-fieldset>
    `;
  }
}
