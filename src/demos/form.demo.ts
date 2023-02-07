import { css, html, PropertyValueMap } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';
import { Component } from './demo-app/component';

import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/card/card';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/option/option';
import 'shoelace-widgets';

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
    this._formRef.value!.addEventListener('submit', this._onFormSubmit);
  }

  render() {
    return html`
      <style>
        .validity-styles sl-input,
        .validity-styles sl-select {
          margin-bottom: var(--sl-spacing-medium);
        }

        /* user invalid styles */
        .validity-styles sl-input[data-user-invalid]::part(base),
        .validity-styles sl-select[data-user-invalid]::part(control) {
          border-color: var(--sl-color-danger-600);
        }

        .validity-styles [data-user-invalid]::part(form-control-label),
        .validity-styles [data-user-invalid]::part(form-control-help-text) {
          color: var(--sl-color-danger-700);
        }

        .validity-styles sl-input:focus-within[data-user-invalid]::part(base),
        .validity-styles
          sl-select:focus-within[data-user-invalid]::part(control) {
          border-color: var(--sl-color-danger-600);
          box-shadow: 0 0 0 var(--sl-focus-ring-width)
            var(--sl-color-danger-300);
        }

        /* User valid styles */
        .validity-styles sl-input[data-user-valid]::part(base),
        .validity-styles sl-select[data-user-valid]::part(control) {
          border-color: var(--sl-color-success-600);
        }

        .validity-styles [data-user-valid]::part(form-control-label),
        .validity-styles [data-user-valid]::part(form-control-help-text) {
          color: var(--sl-color-success-700);
        }

        .validity-styles sl-input:focus-within[data-user-valid]::part(base),
        .validity-styles
          sl-select:focus-within[data-user-valid]::part(control) {
          border-color: var(--sl-color-success-600);
          box-shadow: 0 0 0 var(--sl-focus-ring-width)
            var(--sl-color-success-300);
        }
      </style>
      <sl-card>
        <div slot="header">Form demo</div>
        <form class="input-validation-required" ${ref(this._formRef)}>
          <sx-text-field
            name="firstName"
            value="Jane"
            label="First name"
            required
          >
          </sx-text-field>
          <sx-text-field
            name="lastName"
            value="Doe"
            label="Last name"
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

  firstUpdated() {
    const form = this.shadowRoot!.querySelector('form')!;

    alterValidation(form);
  }

  render() {
    return html`
      <form class="demo-form">
        <sx-fieldset label-layout="horizontal">
          <sx-fieldset caption="Address">
            <sx-text-field
              name="firstName"
              label="First name"
              required
            ></sx-text-field>
            <sx-text-field
              name="lastName"
              label="Last name"
              help-text="We will always call you by your last name"
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
}

function alterValidation(form: HTMLFormElement) {
  //form.setAttribute('novalidate', '');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const input = form.querySelector<HTMLInputElement>("[name='firstName']")!;

    alert(input.shadowRoot!.querySelector('input')?.validity.valid);
    //alert('submit');
  });

  form.addEventListener(
    'invalid',
    (ev: Event) => {
      alert('invalid');
      ev.preventDefault();
    },
    true
  );

  form.addEventListener('input', (ev: Event) =>
    console.log('input', (ev.target as any).value)
  );
}
