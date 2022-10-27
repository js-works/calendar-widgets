import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';

// components
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab';
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group';
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel';
import { DialogsController } from '../../main/shoelace-widgets-lit';
import { TextField } from '../../main/shoelace-widgets';
import { TextArea } from '../../main/shoelace-widgets';
import { Choice } from '../../main/shoelace-widgets';
import { CompoundField } from '../../main/shoelace-widgets';
import { Fieldset } from '../../main/shoelace-widgets';
import { Form } from '../../main/shoelace-widgets';
import { FormSection } from '../../main/shoelace-widgets';
import { Sidenav } from '../../main/shoelace-widgets';

import './shared/shared-theme';

export default {
  title: 'shoelace-widgets'
};

export const dialogs = () =>
  '<dialogs-demo class="sl-theme-light"></dialogs-demo>';

const styles = css`
  :host {
    padding: 3rem;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);
  }

  .demo sl-button {
    width: 9rem;
    margin: 4px 2px;
  }
`;

@customElement('dialogs-demo')
class DialogsDemo extends LitElement {
  static styles = styles;

  static {
    // depenencies (to prevent too much tree shaking)
    void [
      CompoundField,
      Choice,
      Fieldset,
      Form,
      FormSection,
      TextArea,
      TextField,
      Sidenav,
      SlTab,
      SlTabGroup,
      SlTabPanel
    ];
  }

  private _dlg = new DialogsController(this);

  private _onInfoClick = () => {
    this._dlg.info({
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Thanks :-)'
    });
  };

  private _onSuccessClick = () => {
    this._dlg.success({
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Good to know'
    });
  };

  private _onWarnClick = () => {
    this._dlg.warn({
      message: 'This is your last warning',
      title: 'Important!!!',
      okText: 'OK - I understand'
    });
  };

  private _onErrorClick = () => {
    this._dlg.error({
      message: 'The form could not be submitted',
      title: 'Form error',
      okText: 'OK - I understand'
    });
  };

  private _onConfirmClick = async () => {
    const confirmed = await this._dlg.confirm({
      message: 'Do you really want to log out?',
      okText: 'Log out'
    });

    if (confirmed) {
      this._dlg.info({
        message: "You've been logged out"
      });
    }
  };

  private _onApproveClick = async () => {
    const approved = await this._dlg.approve({
      message: 'Do you really want to delete the project?',
      title: 'Are you sure?',
      okText: 'Delete project'
    });

    if (approved) {
      this._dlg.info({
        message: 'Project has been deleted'
      });
    }
  };

  private _onPromptClick = async () => {
    const name = await this._dlg.prompt({
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    });

    if (name !== null) {
      this._dlg.info({
        message: `Hello, ${name || 'stranger'}!`
      });
    }
  };

  private _onInputClick = async () => {
    const data = await this._dlg.input({
      title: 'Add new user',
      labelLayout: 'horizontal',
      width: '45rem',

      content: html`
        <sx-sidenav>
          <sx-fieldset caption="Account">
            <sx-choice
              label="Salutation"
              type="horizontal-radios"
              .options=${[
                { value: 'mrs', text: 'Mrs.' },
                { value: 'mr', text: 'Mr.' },
                { value: 'x', text: 'Other' }
              ]}
            ></sx-choice>
            <sx-text-field
              label="First name"
              name="firstName"
              required
            ></sx-text-field>
            <sx-text-field
              label="Middle name"
              name="middleName"
            ></sx-text-field>
            <sx-text-field
              label="Last name"
              name="lastName"
              required
            ></sx-text-field>
          </sx-fieldset>
          <sx-fieldset caption="Address">
            <sx-vbox>
              <sx-text-field label="Street" required></sx-text-field>
              <sx-compound-field label="Zip / City" column-widths="30% 70%">
                <sx-text-field name="zip" required></sx-text-field>
                <sx-text-field name="city" required></sx-text-field>
              </sx-compound-field>
              <sx-choice
                label="Country"
                required
                .options=${[
                  { value: 'gb', text: 'Great Britain' },
                  { value: 'us', text: 'USA' }
                ]}
              ></sx-choice>
            </sx-vbox>
          </sx-fieldset>
        </sx-sidenav>
      `,

      okText: 'Add user'
    });
  };

  private _onDestroyPlanet = async () => {
    const confirmed = await this._dlg.confirm({
      message: 'Are you really sure that the planet shall be destroyed?'
    });

    if (confirmed) {
      const approved = await this._dlg.approve({
        message:
          'But this is such a lovely planet. ' +
          'Are you really, really sure it shall be destroyed?',

        okText: 'Destroy!',
        cancelText: 'Abort'
      });

      if (approved) {
        this._dlg.error({
          message:
            'You are not allowed to destroy planets. ' +
            'Only Darth Vader is authorized.'
        });
      }
    }
  };

  render() {
    return html`
      <div class="demo">
        <div>
          <sl-button @click=${this._onInfoClick}>Info</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onSuccessClick}>Success</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onWarnClick}>Warn</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onErrorClick}>Error</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onConfirmClick}>Confirm</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onApproveClick}>Approve</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onPromptClick}>Prompt</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onInputClick}>Input</sl-button>
        </div>
        <br />
        <sl-button @click=${this._onDestroyPlanet}>
          Destroy planet &#x1F609;
        </sl-button>
      </div>
      ${this._dlg.render()}
    `;
  }
}
