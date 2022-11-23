import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Choice } from '../main/shoelace-widgets/components/choice/choice';
import { DateField } from '../main/shoelace-widgets/components/date-field/date-field';
import { Fieldset } from '../main/shoelace-widgets/components/fieldset/fieldset';

export default {
  title: 'shoelace-widgets'
};

export const dateFields = () => '<date-field-demo></date-field-demo>';

const styles = css`
  .base {
    display: block;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    max-width: 30rem;
  }
`;

@customElement('date-field-demo')
class DatePickerDemo extends LitElement {
  static styles = styles;

  static {
    // dependencies (to prevent to much tree shaking)
    void [Choice, DateField, Fieldset];
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
        <sx-choice
          label="Locale"
          value=${this._locale}
          @sl-change=${this._onChange}
          .options=${[
            {
              value: 'en-US',
              text: 'en-US'
            },
            {
              value: 'en-GB',
              text: 'en-GB'
            },
            {
              value: 'es',
              text: 'es'
            },
            {
              value: 'fr',
              text: 'fr'
            },
            {
              value: 'de',
              text: 'de'
            },
            {
              value: 'it',
              text: 'it'
            },
            {
              value: 'ar-SA',
              text: 'ar-SA'
            }
          ]}
        >
        </sx-choice>
        <br />
        <sx-date-field label="Date" lang=${this._locale}></sx-date-field>
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
          label="Month"
          selection-mode="month"
          lang=${this._locale}
        ></sx-date-field>
        <sx-date-field
          label="Year"
          selection-mode="year"
          enable-century-view
          lang=${this._locale}
        ></sx-date-field>
      </sx-fieldset>
    `;
  }
}