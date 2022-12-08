import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlCard from '@shoelace-style/shoelace/dist/components/card/card';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

export const formDemo = () => '<form-demo></form-demo>';

const styles = /*css*/ `
`;

@customElement('form-demo')
class FormDemo extends LitElement {
  static {
    // required dependencies (to prevent too much tree shaking)
    void [SlButton, SlCard, SlInput];
  }

  render() {
    return html`
      <sl-card>
        <div slot="header">Form demo</div>
        <form>
          <sl-input name="firstName" label="First name" required></sl-input>
          <sl-input name="lastName" label="Last name" required></sl-input>
          <sl-input name="city" label="City" required></sl-input>
          <br />
          <sl-button type="submit" variant="primary">Submit</sl-button>
        </form>
      </sl-card>
    `;
  }
}
