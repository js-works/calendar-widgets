import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { DatePicker } from '../main/shoelace-widgets/components/date-picker/vanilla/__date-picker';
//import { Calendar2 } from '../main/shoelace-widgets/components/date-picker/vanilla/calendar2';

export const newDatePickerDemo = () => '<new-date-picker></new-date-picker>';

const datePicker = new DatePicker();

const styles = css`
  .cal-base {
    border: 1px solid red;
  }

  .cal-sheet-navi {
    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: center;
    border: 1px solid green;
  }

  .cal-sheet-title {
    text-align: center;
  }

  .cal-sheet {
    display: grid;
  }
`;

@customElement('new-date-picker')
class DatePicker2 extends LitElement {
  static styles = styles;

  render() {
    return html`${unsafeHTML(datePicker.renderToString())}`;
  }
}
