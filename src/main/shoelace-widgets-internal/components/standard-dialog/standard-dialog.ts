import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import {
  DialogConfig,
  DialogType
} from '../../controllers/abstract-dialogs-controller';

export { StandardDialog };

import { LocalizeController } from '../../../shoelace-widgets/i18n/i18n';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { AbstractDialogsController } from '../../controllers/abstract-dialogs-controller';
import type { FormSubmitEvent } from 'shoelace-widgets';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { Form } from '../../../shoelace-widgets/components/form/form';
import { TextField } from '../../../shoelace-widgets/components/text-field/text-field';

// icons
import infoIcon from '../../../shoelace-widgets/icons/bootstrap/info-square.icon';
import successIcon from '../../../shoelace-widgets/icons/bootstrap/check2-square.icon';
import warningIcon from '../../../shoelace-widgets/icons/bootstrap/exclamation-diamond.icon';
import errorIcon from '../../../shoelace-widgets/icons/bootstrap/exclamation-triangle.icon';
import confirmationIcon from '../../../shoelace-widgets/icons/bootstrap/question-diamond.icon';
import approvalIcon from '../../../shoelace-widgets/icons/bootstrap/question-diamond.icon';
import promptIcon from '../../../shoelace-widgets/icons/bootstrap/keyboard.icon';

// styles
import standardDialogStyles from './standard-dialog.styles';

// === local constants ===============================================

const icons = Object.freeze({
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon,
  confirmation: confirmationIcon,
  approval: approvalIcon,
  prompt: promptIcon,
  input: null
});

const def: Record<
  DialogType,
  {
    buttons: {
      action: 'ok' | 'cancel';
      variant?: 'default' | 'primary' | 'success' | 'danger';
      autofocus?: boolean;
    }[];

    mapResult?: (action: string, data: Record<string, any>) => unknown;
  }
> = {
  info: {
    buttons: [
      {
        action: 'ok',
        variant: 'primary',
        autofocus: true
      }
    ]
  },

  success: {
    buttons: [
      {
        action: 'ok',
        variant: 'success',
        autofocus: true
      }
    ]
  },

  warning: {
    buttons: [
      {
        action: 'ok',
        variant: 'danger',
        autofocus: true
      }
    ]
  },

  error: {
    buttons: [
      {
        action: 'ok',
        variant: 'danger',
        autofocus: true
      }
    ]
  },

  confirmation: {
    buttons: [
      {
        action: 'cancel'
      },
      {
        action: 'ok',
        variant: 'primary',
        autofocus: true
      }
    ],
    mapResult: (action) => action === 'ok'
  },

  approval: {
    buttons: [
      {
        action: 'cancel',
        autofocus: true
      },
      {
        action: 'ok',
        variant: 'danger'
      }
    ],
    mapResult: (action) => action === 'ok'
  },

  prompt: {
    buttons: [
      {
        action: 'cancel'
      },
      {
        action: 'ok',
        variant: 'primary',
        autofocus: true
      }
    ],
    mapResult: (action, { input }) => (action === 'cancel' ? null : input)
  },

  input: {
    buttons: [
      {
        action: 'cancel'
      },
      {
        action: 'ok',
        variant: 'primary',
        autofocus: true
      }
    ],
    mapResult: (action, data) => (action === 'cancel' ? null : data)
  }
};

@customElement('sx-standard-dialog--internal')
class StandardDialog extends LitElement {
  static readonly styles = standardDialogStyles;

  @property({ attribute: false })
  config: DialogConfig | null = null;

  @property({ attribute: false })
  onDialogClosed: ((result: unknown) => void) | null = null;

  @property({ type: Boolean, attribute: false })
  open = true; // TODO!!!

  @property()
  lang: string = '';

  @property()
  dir: string = '';

  private _localize = new LocalizeController(this);
  // TODO
  private _translate = (key: string) =>
    this._localize.term(`shoelaceWidgets.dialogs/${key}`);
  private _formRef = createRef<Form>();
  private _dialogRef = createRef<SlDialog>();

  private _lastClickedAction = '';

  private _onFormSubmit = (ev: FormSubmitEvent) => {
    ev.preventDefault();
    const data = { ...ev.detail.data };

    setTimeout(async () => {
      const action = this._lastClickedAction;
      await this._dialogRef.value!.hide();

      let result = undefined;
      const mapResult = def[this.config!.type].mapResult;

      if (mapResult) {
        result = mapResult(action, data);
      }

      this.onDialogClosed!(result);
    });
  };

  private _onFormInvalid = async () => {
    // TODO!!!
  };

  override willUpdate() {
    const colorScheme = getComputedStyle(this).colorScheme;

    if (colorScheme === 'dark') {
      this.style.setProperty('--dialog--light', ' ');
      this.style.setProperty('--dialog--dark', 'initial');
    } else {
      this.style.setProperty('--dialog--light', 'initial');
      this.style.setProperty('--dialog--dark', ' ');
    }
  }

  render() {
    if (!this.config) {
      return null;
    }

    let additionalContent: TemplateResult = html``;

    if (this.config.type === 'prompt') {
      const value = this.config.value === 'string' ? this.config.value : '';

      additionalContent = html`
        <sx-text-field name="input" size="small" autofocus value=${value}>
        </sx-text-field>
      `;
    }

    const labelLayout =
      this.config.type !== 'input'
        ? 'auto'
        : this.config.labelLayout === 'vertical'
        ? 'vertical'
        : this.config.labelLayout === 'horizontal'
        ? 'horizontal'
        : 'auto';

    const onAfterHide = (ev: Event) => {
      /* TODO!!!
      if (ev.target === dialogRef.value) {
        this.dismissDialog();
      }
      */
    };

    return html`
      <style>
        .dialog::part(panel) {
          width: ${this.config.width ? this.config.width : 'auto'};
          max-width: ${this.config.maxWidth ? this.config.maxWidth : 'auto'};
          height: ${this.config.height ? this.config.height : 'auto'};
          max-height: ${this.config.maxHeight ? this.config.maxHeight : 'auto'};
        }
      </style>
      <sx-form
        class=${classMap({
          'form': true,
          'label-layout-vertical': labelLayout === 'vertical',
          'label-layout-horizontal': labelLayout === 'horizontal'
        })}
        dir=${this._localize.dir()}
        @sx-form-submit=${this._onFormSubmit}
        @sx-form-invalid=${this._onFormInvalid}
        ${ref(this._formRef)}
      >
        <sl-dialog
          ?open=${this.open}
          class=${classMap({
            dialog: true,
            [`dialog--${this.config.type}`]: true
          })}
          @sl-after-hide=${onAfterHide}
          ${ref(this._dialogRef)}
        >
          <div slot="label" class="header">
            ${when(
              icons[this.config.type],
              () => html` <sl-icon
                class="icon ${this.config!.type}"
                src=${icons[this.config!.type]}
              ></sl-icon>`
            )}
            <div class="title">${this.config.title}</div>
          </div>
          <div
            class="main"
            style=${styleMap({
              padding:
                'padding' in this.config ? (this.config as any).padding : null
            })}
          >
            ${when(
              this.config.message,
              () => html` <div class="message">
                ${textToResultTemplate(
                  typeof this.config!.message === 'function'
                    ? this.config!.message()
                    : this.config!.message
                )}
              </div>`
            )}
            <div class="content">
              <slot></slot>
              ${additionalContent}
            </div>
          </div>
          <div slot="footer">
            <div class="buttons">
              ${repeat(
                (def as any)[this.config.type as any].buttons,
                ({ action, variant = 'default', autofocus }, idx) => {
                  const onClick = () => {
                    this._lastClickedAction = action;
                    this._formRef.value!.submit();
                  };

                  const textKey = action === 'ok' ? 'okText' : 'cancelText';

                  let text = (this.config as any)[textKey];

                  if (typeof text !== 'string') {
                    text = this._translate(action);
                  }

                  return html`
                    <sl-button
                      type="submit"
                      variant=${variant}
                      value=${idx}
                      ?autofocus=${autofocus}
                      class="button"
                      @click=${onClick}
                    >
                      ${text}
                    </sl-button>
                  `;
                }
              )}
            </div>
          </div>
          </div>
        </sl-dialog>
      </sx-form>
    `;
  }
}

function textToResultTemplate(
  text: string | null | undefined
): TemplateResult | null {
  if (!text) {
    return null;
  }

  const lines = text.split(/$/gm);

  return html`${repeat(lines, (line) => html`${line}<br />`)}`;
}
