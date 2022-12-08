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

  private _onFormSubmit = (ev: Event) => {
    ev.preventDefault();
    alert('All field valid');
  };

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
        <form class="validity-styles" @submit=${this._onFormSubmit}>
          <sl-input name="firstName" label="First name" required></sl-input>
          <sl-input name="lastName" label="Last name" required></sl-input>
          <sl-input name="city" label="City" required></sl-input>
          <br />
          <sl-button type="reset">Reset</sl-button>
          <sl-button type="submit" variant="primary">Submit</sl-button>
        </form>
      </sl-card>
    `;
  }
}
