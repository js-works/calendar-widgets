import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { DateField } from '../../main/shoelace/components/date-field/date-field';

import './shared/shared-theme';

export default {
  title: 'Shoelace'
};

export const dateFields = () => '<date-field-demo></date-field-demo>';

const styles = css`
  .base {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    width: 15rem;
  }
`;

@customElement('date-field-demo')
class DatePickerDemo extends LitElement {
  static styles = styles;

  static {
    // dependencies (to prevent to much tree shaking)
    void DateField;
  }

  render() {
    return html`
      <div class="base">
        <sx-date-field label="Date" show-adjacent-days></sx-date-field>
        <sx-date-field
          label="Date and time"
          selection-mode="dateTime"
          show-adjacent-days
        ></sx-date-field>
        <sx-date-field label="Time" selection-mode="time"></sx-date-field>
        <sx-date-field
          label="Date range"
          selection-mode="dateRange"
          show-adjacent-days
        ></sx-date-field>
        <sx-date-field
          label="Week"
          selection-mode="week"
          show-week-numbers
          show-adjacent-days
        ></sx-date-field>
        <sx-date-field label="Month" selection-mode="month"></sx-date-field>
        <sx-date-field label="Year" selection-mode="year"></sx-date-field>
      </div>
    `;
  }
}
