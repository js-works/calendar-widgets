import { css, html, PropertyValueMap } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';
import { Component } from './demo-app/component';
import { loadPlugin } from 'shoelace-widgets/plugins';

import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/card/card';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/option/option';

export const formDemo = () => '<form-demo2></form-demo2>';

const styles = css`
  .demo-form {
    max-width: 30rem;
  }
`;

@customElement('form-demo')
class FormDemo extends Component {
  static styles = css`
    ${super.styles}
    ${styles}
  `;

  private _formRef = createRef<HTMLFormElement>();

  private _onFormSubmit = (ev: SubmitEvent) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const formData = new FormData(form);
    const values: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        const value = formData.getAll(key);
        console.log(value);
        values[key] = String(value);
      } else {
        console.log(key, value);
      }
    }

    alert(JSON.stringify(values, null, 2));
  };

  override firstUpdated() {
    this._formRef.value!.addEventListener(
      'invalid',
      (ev) => {
        console.log('invalid ->', ev.target);
      },
      true
    );
    this._formRef.value!.addEventListener('submit', this._onFormSubmit);
  }

  render() {
    return html`
      <sl-card>
        <div slot="header">Form demo</div>
        <form class="input-validation-required" ${ref(this._formRef)}>
          <sx-text-field
            name="firstName"
            value="Jane"
            label="First name"
            autocomplete="off"
            required
          >
          </sx-text-field>
          <sx-text-field
            name="lastName"
            value="Doe"
            label="Last name"
            autocomplete="off"
            required
          ></sx-text-field>

          <!--
          <sl-select name="selection" value="v1 v2" multiple>
            <sl-option value="v1">Value 1</sl-option>
            <sl-option value="v2">Value 2</sl-option>
          </sl-select>
          -->

          <!--
          <select name="selection2" multiple>
            <option selected>x1</option>
            <option selected>x2</option>
          </select>
          -->

          <sx-text-field
            name="email"
            value="zzz"
            type="email"
            label="Email (sx-text-field)"
            required
          ></sx-text-field>

          <sl-button type="submit" variant="primary">Submit</sl-button>
        </form>
      </sl-card>
    `;
  }
}

@customElement('form-demo2')
class DialogsDemo2 extends Component {
  static styles = css`
    ${super.styles}
    ${styles}
  `;

  firstUpdated() {}

  render() {
    return html`
      <form class="demo-form">
        <sx-fieldset>
          <sl-input
            name="firstName"
            label="First name"
            autocomplete="off"
            required
          ></sl-input>
          <sl-input
            name="lastName"
            label="Last name"
            help-text="We will always call you by your last name"
            autocomplete="off"
            required
          ></sl-input>
          <sl-select
            name="country"
            label="Country"
            help-text="Only Great Britain and USA allowed"
            required
            clearable
          >
            <sl-option value="gb">Great Britain</sl-option>
            <sl-option value="us">United States</sl-option>
          </sl-select>
          <sl-input name="phone" type="phone" label="Phone" required></sl-input>
          <sl-input name="email" type="email" label="Email" required></sl-input>
        </sx-fieldset>
        <br />
        <sl-button type="submit" variant="primary">Submit</sl-button>
        <sl-button type="reset">Reset</sl-button>
      </form>
    `;
  }

  /*
  render() {
    return html`
      <form class="demo-form">
        <sx-fieldset label-layout="horizontal">
          <sx-fieldset caption="Address">
            <sx-text-field
              name="firstName"
              label="First name"
              autocomplete="off"
              required
            ></sx-text-field>
            <sx-text-field
              name="lastName"
              label="Last name"
              help-text="We will always call you by your last name"
              autocomplete="off"
              required
            ></sx-text-field>
            <sl-select
              name="country"
              label="Country"
              help-text="Only Great Britain and USA allowed"
              required
              clearable
            >
              <sl-option value="gb">Great Britain</sl-option>
              <sl-option value="us">United States</sl-option>
            </sl-select>
          </sx-fieldset>
          <sx-fieldset caption="Phone + Email">
            <sx-text-field
              name="phone"
              type="phone"
              label="Phone"
              required
            ></sx-text-field>
            <sx-text-field
              name="email"
              type="email"
              label="Email"
              required
            ></sx-text-field>
          </sx-fieldset>
        </sx-fieldset>
        <br />
        <sl-button type="submit" variant="primary">Submit</sl-button>
        <sl-button type="reset">Reset</sl-button>
      </form>
    `;
  }
  */
}
