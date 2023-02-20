import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Component } from './demo-app/component';

// components
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab';
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group';
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel';
import { DialogsController, ToastType } from '../main/shoelace-widgets-lit';
import { TextField } from '../main/shoelace-widgets';
import { CompoundField } from '../main/shoelace-widgets';
import { Fieldset } from '../main/shoelace-widgets';
import { FormSection } from '../main/shoelace-widgets';
import 'shoelace-widgets';

export default {
  title: 'shoelace-widgets'
};

export const dialogs = () =>
  '<dialogs-demo class="sl-theme-light"></dialogs-demo>';

const styles = css`
  .section {
    width: 30rem;
    grid-template-columns: auto auto;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);
  }

  .section sl-button {
    width: 10rem;
    margin: 4px 2px;
  }

  .headline {
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
  }
`;

@customElement('dialogs-demo')
class DialogsDemo extends Component {
  static styles = styles;

  static {
    // depenencies (to prevent too much tree shaking)
    void [
      CompoundField,
      Fieldset,
      FormSection,
      TextField,
      SlTab,
      SlTabGroup,
      SlTabPanel
    ];
  }

  private readonly _dialogs = new DialogsController(this);

  private _onInfoClick = () => {
    this._dialogs.show('info', {
      message: 'Your question has been submitted successfully.',
      title: 'Submit',
      okText: 'Thanks :-)'
    });
  };

  private _onSuccessClick = () => {
    this._dialogs.show('success', {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Good to know'
    });
  };

  private _onWarnClick = () => {
    this._dialogs.show('warn', {
      message: 'This is your last warning.',
      title: 'Important!!!',
      okText: 'OK - I understand'
    });
  };

  private _onErrorClick = () => {
    this._dialogs.show('error', {
      message: 'File "logs.txt" does not exist.'
    });
  };

  private _onConfirmClick = async () => {
    const confirmed = await this._dialogs.show('confirm', {
      message: 'Do you really want to log out?',
      okText: 'Log out'
    });

    if (confirmed) {
      await pause(200);

      this._dialogs.show('info', {
        message: "You've been logged out"
      });
    }
  };

  private _onApproveClick = async () => {
    const approved = await this._dialogs.show('approve', {
      message:
        'Are you really sure that you want to deactivate the account?\nAll data will be deleted.',
      title: 'Deactivate account',
      okText: 'Deactivate'
    });

    if (approved) {
      this._dialogs.show('info', {
        message: 'Account has been deactivated'
      });
    }
  };

  private _onPromptClick = async () => {
    const name = await this._dialogs.show('prompt', {
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    });

    if (name !== null) {
      await pause(200);

      this._dialogs.show('info', {
        message: `Hello, ${name || 'stranger'}!`
      });
    }
  };

  private _onInputClick = async () => {
    const data = await this._dialogs.show('input', {
      title: 'Switch user',
      width: '15rem',
      content: html`
        <sx-fieldset label-layout="horizontal" validation-mode="inline">
          <!--
          <sx-text-field
            label="Username"
            name="username"
            help-text="Please enter your username here"
            required
            autofocus
          ></sx-text-field>
    -->
          <sx-text-field
            label="Email"
            name="Email"
            type="email"
            required
            autofocus
            autocomplete="off"
          ></sx-text-field>
          <!--
          <sl-input
            label="Password"
            type="password"
            name="password"
            required
            autocomplete="off"
          ></sl-input>
    -->
        </sx-fieldset>
      `
    });

    if (data) {
      this._dialogs.show('info', {
        title: 'Form data',
        message: JSON.stringify(data, null, 2)
      });
    }
  };

  private _onInput2Click = async () => {
    const data = await this._dialogs.show('input', {
      title: 'Add new user',
      width: '34rem',
      height: '34rem',
      padding: '0.25rem 1rem',

      content: html`
        <sx-fieldset label-layout="horizontal" validation-mode="inline">
          <sx-fieldset caption="User">
            <sl-radio-group label="Salutation" required data-horizontal>
              <sl-radio value="mrs">Mrs.</sl-radio>
              <sl-radio value="mr">Mr.</sl-radio>
              <sl-radio value="other">Other</sl-radio>
            </sl-radio-group>
            <sx-text-field
              label="First name"
              name="firstName"
              required
            ></sx-text-field>
            <sx-text-field
              label="Last name"
              name="lastName"
              required
            ></sx-text-field>
            <sx-date-field
              label="Date of birth"
              name="dayOfBirth"
              show-adjacent-days
              fixed-day-count
            ></sx-date-field>
          </sx-fieldset>
          <sx-fieldset caption="Address">
            <sx-text-field label="Street"></sx-text-field>
            <sx-compound-field label="Zip / City" column-widths="30% 70%">
              <sx-text-field name="zip"></sx-text-field>
              <sx-text-field name="city"></sx-text-field>
            </sx-compound-field>
            <sl-select label="Country" required help-text="Currently only USA and Canada available">
              <sl-option value="gb">Great Britain</sl-option>
              <sl-option value="us">United States</sl-option>
            </sl-select>
          </sx-fieldset>
          <sx-fieldset caption="Phone + email">
            <sx-text-field name="phone" type="phone" label="Phone" required>
            </sx-text-field>
            <sx-text-field name="cellphone" type="cellphone" label="Mobile">
            </sx-text-field>
            <sx-text-field
              name="email"
              type="email"
              label="Email address"
              required
            >
            </sx-text-field>
          </sx-fieldset>
          <sx-fieldset caption="Company">
            <sx-text-field name="company" label="Company" aria-required>
            </sx-text-field>
            <sx-text-field name="companyStreet" label="Street" aria-required>
            </sx-text-field>
            <sx-compound-field label="Zip / City" column-widths="30% 70%">
              <sx-text-field name="companyPostalCode" aria-required>
              </sx-text-field>
              <sx-text-field name="companyCity" aria-required> </sx-text-field>
            </sx-compound-field>
            <sl-select label="Country" name="companyCountry" required>
              <sl-option value="gb">Great Britain</sl-option>
              <sl-option value="us">USA</sl-option>
            </sl-select>
          </sx-fieldset>
          <sx-fieldset caption="Notes and comments" label-layout="vertical">
            <sl-textarea label="General notes" rows="5"></sx-textarea>
            <sl-textarea label="Comments" rows="5"></sx-textarea>
          </sx-fieldset>
        </sx-fieldset>
      `,

      okText: 'Add user'
    });

    if (data) {
      this._dialogs.show('info', {
        title: 'Form data',
        message: JSON.stringify(data, null, 2)
      });
    }
  };

  private _onDestroyPlanet = async () => {
    const confirmed = await this._dialogs.show('confirm', {
      message: 'Are you really sure that the planet shall be destroyed?'
    });

    if (confirmed) {
      await pause(200);

      const approved = await this._dialogs.show('approve', {
        message:
          'But this is such a lovely planet. ' +
          'Are you really, really sure it shall be destroyed?',

        okText: 'Destroy!',
        cancelText: 'Abort'
      });

      if (approved) {
        await pause(200);

        await this._dialogs.show('error', {
          message:
            'You are not allowed to destroy planets. ' +
            'Only Darth Vader is authorized.'
        });
      }
    }
  };

  private _showToast(type: ToastType, title: string) {
    const now = new Date();

    const time = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(11, 19);

    this._dialogs.toast(type, {
      title,
      message: 'Toast was opened at ' + time,
      content: html`<strong>Some extra content...</strong>`
    });
  }

  render() {
    return html`
      <div>
        <h4 class="headline">Dialogs</h4>
        <div class="section">
          <sl-button @click=${this._onInfoClick}>Info</sl-button>
          <sl-button @click=${this._onSuccessClick}>Success</sl-button>
          <sl-button @click=${this._onWarnClick}>Warn</sl-button>
          <sl-button @click=${this._onErrorClick}>Error</sl-button>
          <sl-button @click=${this._onConfirmClick}>Confirm</sl-button>
          <sl-button @click=${this._onApproveClick}>Approve</sl-button>
          <sl-button @click=${this._onPromptClick}>Prompt</sl-button>
          <sl-button @click=${this._onInputClick}>Input</sl-button>
          <sl-button @click=${this._onInput2Click}>Input 2</sl-button>
          <sl-button @click=${this._onDestroyPlanet}>
            Destroy planet &#x1F609;
          </sl-button>
        </div>
      </div>
      <div>
        <h4 class="headline">Toasts</h4>
        <div class="section">
          <sl-button @click=${() => this._showToast('info', 'Information')}>
            Info
          </sl-button>
          <sl-button @click=${() => this._showToast('success', 'Success')}>
            Success
          </sl-button>
          <sl-button @click=${() => this._showToast('warn', 'Warning')}>
            Warn
          </sl-button>
          <sl-button @click=${() => this._showToast('error', 'Error')}>
            Error
          </sl-button>
        </div>
        ${this._dialogs.render()}
      </div>
    `;
  }
}

function pause(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
