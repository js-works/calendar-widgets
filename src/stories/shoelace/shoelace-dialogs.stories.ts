import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { DialogsController } from '../../main/shoelace-widgets-lit';
import { TextField } from '../../main/shoelace/components/text-field/text-field';
import { Form } from '../../main/shoelace-widgets';

export default {
  title: 'Shoelace'
};

export const dialogs = () =>
  '<dialogs-demo class="sl-theme-light"></dialogs-demo>';

const styles = css`
  :host {
    padding: 3rem;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);

    /* TODO!!! */
    --label-layout-horizontal: inherit;
    --label-layout-vertical: ;
  }

  .demo sl-button {
    width: 8rem;
    margin: 4px 2px;
  }
`;

@customElement('dialogs-demo')
class DialogsDemo extends LitElement {
  static styles = styles;

  static {
    // depenencies (to prevent too much tree shaking)
    void [TextField];
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

  private _onConfirmClick = () => {
    this._dlg
      .confirm({
        message: 'Do you really want to log out?',
        okText: 'Log out'
      })
      .then(async (confirmed) => {
        if (confirmed) {
          this._dlg.info({
            message: "You've been logged out"
          });
        }
      });
  };

  private _onApproveClick = () => {
    this._dlg
      .approve({
        message: 'Do you really want to delete the project?',
        title: 'Are you sure?',
        okText: 'Delete project'
      })
      .then((approved) => {
        if (approved) {
          this._dlg.info({
            message: 'Project has been deleted'
          });
        }
      });
  };

  private _onPromptClick = () => {
    this._dlg
      .prompt({
        message: 'Please enter your name',
        title: 'Input required',
        cancelText: 'No way!'
      })
      .then(async (name) => {
        if (name !== null) {
          this._dlg.info({
            message: `Hello, ${name || 'stranger'}!`
          });
        }
      });
  };

  private _onInputClick = () => {
    this._dlg
      .input({
        message: 'Please enter data of new user',
        title: 'Add user',
        content: html`
          <sx-text-field
            name="firstName"
            label="First name"
            required
          ></sx-text-field>
          <sx-text-field
            name="lastName"
            label="Last name"
            required
          ></sx-text-field>
        `
      })
      .then(async (name) => {
        if (name !== null) {
          this._dlg.info({
            message: `Done!`
          });
        }
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
        <sl-button @click=${this._onDestroyPlanet}>Destroy planet</sl-button>
      </div>
      ${this._dlg.render()}
    `;
  }
}
