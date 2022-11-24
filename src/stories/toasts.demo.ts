import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

// controllers
import { ToastsController } from '../main/shoelace-widgets-lit';

// components
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';

export default {
  title: 'shoelace-widgets'
};

export const toasts = () =>
  '<toasts-demo class="sl-theme-light"></toasts-demo>';

const styles = css`
  :host {
    padding: 3rem;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);
  }

  .button {
    width: 9rem;
    margin: 4px 2px;
  }
`;

@customElement('toasts-demo')
class toastsDemo extends LitElement {
  static styles = styles;

  static {
    // required components (to prevent too much tree shaking)
    void [SlButton];
  }

  private _toasts = new ToastsController(this);

  private _onInfoClick = () => {
    this._toasts.info({
      message: 'Your next meeting starts in 15 minutes',
      title: 'Info'
    });
  };

  private _onSuccessClick = () => {
    this._toasts.success({
      message: 'Your question has been submitted successfully',
      title: 'Success'
    });
  };

  private _onWarnClick = () => {
    this._toasts.warn({
      message: 'This is your last warning',
      title: 'Warning'
    });
  };

  private _onErrorClick = () => {
    this._toasts.error({
      message: 'The form could not be submitted',
      title: 'Error'
    });
  };

  render() {
    return html`
      <div class="demo">
        <div>
          <sl-button class="button" @click=${this._onInfoClick}>Info</sl-button>
        </div>
        <div>
          <sl-button class="button" @click=${this._onSuccessClick}>
            Success
          </sl-button>
        </div>
        <div>
          <sl-button class="button" @click=${this._onWarnClick}>Warn</sl-button>
        </div>
        <div>
          <sl-button class="button" @click=${this._onErrorClick}>
            Error
          </sl-button>
        </div>
        <br />
      </div>
      ${this._toasts.render()}
    `;
  }
}
