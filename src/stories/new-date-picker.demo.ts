import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { DatePicker } from '../main/shoelace-widgets/components/date-picker/vanilla/__calendar';
//import { Calendar2 } from '../main/shoelace-widgets/components/date-picker/vanilla/calendar2';

export const newDatePickerDemo = () => '<new-date-picker></new-date-picker>';

const datePicker = new DatePicker();

const styles = css``;

@customElement('new-date-picker')
class DatePicker2 extends LitElement {
  static styles = styles;

  render() {
    return html`${unsafeHTML(datePicker.renderToString())}`;
  }
}
