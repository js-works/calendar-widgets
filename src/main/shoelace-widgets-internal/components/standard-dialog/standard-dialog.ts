import { html, render, LitElement, TemplateResult } from 'lit';
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

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import { TextField } from '../../../shoelace-widgets/components/text-field/text-field';

// styles
import standardDialogStyles from './standard-dialog.styles';

// === local constants ===============================================

const dialogSettingsByType: Record<
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

  warn: {
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

  confirm: {
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

  approve: {
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
        variant: 'primary'
      }
    ],
    mapResult: (action, data) => (action === 'cancel' ? null : data)
  }
};

@customElement('sx-standard-dialog--internal')
class StandardDialog extends LitElement {
  static readonly styles = standardDialogStyles;

  static {
    // required components (to prevent too much tree shaking)
    void [SlAlert, SlButton, SlDialog, SlIcon, TextField];
  }

  @property({ attribute: false })
  config: DialogConfig | null = null;

  @property({ attribute: false })
  resolve: ((result: unknown) => void) | null = null;

  @property({ type: Boolean, attribute: false })
  open = false;

  @property()
  lang: string = '';

  @property()
  dir: string = '';

  private _localize = new LocalizeController(this);
  // TODO
  private _translate = (key: string) =>
    this._localize.term(`shoelaceWidgets.dialogs/${key}`);

  private _dialogRef = createRef<SlDialog>();
  private _lastClickedAction = '';

  private async _cancelForm() {
    await this._dialogRef.value!.hide();
    let result: unknown = undefined;

    const mapResult = dialogSettingsByType[this.config!.type].mapResult;

    if (mapResult) {
      result = mapResult('cancel', {});
    }

    this.resolve!(result);
  }

  override willUpdate() {
    // TODO - this is not always working
    const colorScheme = getComputedStyle(this).colorScheme;

    if (colorScheme === 'dark') {
      this.style.setProperty('--dialog--light', ' ');
      this.style.setProperty('--dialog--dark', 'initial');
    } else {
      this.style.setProperty('--dialog--light', 'initial');
      this.style.setProperty('--dialog--dark', ' ');
    }
  }

  override firstUpdated() {
    if (!this.config) {
      return;
    }

    const form = this.querySelector('form');

    let additionalContent: TemplateResult = html``;

    if (this.config.type === 'prompt') {
      const value = this.config.value === 'string' ? this.config.value : '';

      additionalContent = html`
        <sx-text-field name="input" size="small" autofocus value=${value}>
        </sx-text-field>
      `;

      const additionalContainer = document.createElement('div');

      render(additionalContent, additionalContainer);
      form!.append(additionalContainer);
    }

    form!.addEventListener('submit', (ev: Event) => {
      ev.preventDefault();
      this._lastClickedAction = 'ok';
      form!.submit();
    });

    form!.submit = () => {
      const formData = new FormData(form!);

      const values: Record<string, string> = {};

      for (const [key, value] of formData.entries()) {
        values[key] = String(formData.getAll(key));
      }

      setTimeout(async () => {
        const action = this._lastClickedAction;
        await this._dialogRef.value!.hide();

        let result = undefined;
        const mapResult = dialogSettingsByType[this.config!.type].mapResult;

        if (mapResult) {
          result = mapResult(action, values);
        }

        this.resolve!(result);
      });
    };
  }

  override updated() {
    if (!this._dialogRef.value) {
      return;
    }

    requestAnimationFrame(() => {
      this._dialogRef.value!.show();
    });
  }

  render() {
    if (!this.config) {
      return null;
    }

    let title = this.config.title
      ? typeof this.config.title === 'function'
        ? this.config.title()
        : this.config.title
      : this._translate(
          'title' +
            this.config.type[0].toUpperCase() +
            this.config.type.substring(1)
        );

    const labelLayout =
      this.config.type !== 'input'
        ? 'auto'
        : this.config.labelLayout === 'vertical'
        ? 'vertical'
        : this.config.labelLayout === 'horizontal'
        ? 'horizontal'
        : 'auto';

    const onAfterShow = () => {
      (this.querySelector('[autofocus]') as unknown as any)?.focus?.();
    };

    const onAfterHide = (ev: Event) => {
      if (ev.target === this._dialogRef.value) {
        if (!this._lastClickedAction) {
          this._cancelForm();
        }
      }
    };

    const onRequestClose = () => {
      this._lastClickedAction = '';
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
      <div
        class=${classMap({
          'form': true,
          'label-layout-vertical': labelLayout === 'vertical',
          'label-layout-horizontal': labelLayout === 'horizontal'
        })}
        dir=${this._localize.dir()}
      >
        <sl-dialog
          ?open=${this.open}
          class=${classMap({
            dialog: true,
            [`dialog--${this.config.type}`]: true
          })}
          @sl-after-show=${onAfterShow}
          @sl-after-hide=${onAfterHide}
          @sl-request-close=${onRequestClose}
          ${ref(this._dialogRef)}
        >
          <div slot="label" class="header">
            ${when(
              this.config.type !== 'input',
              () => html`
                <sl-icon
                  class="icon ${this.config!.type}"
                  library="shoelace-widgets"
                  name=${'dialogs.' + this.config!.type}
                ></sl-icon>
              `
            )}
            <div class="title">${title}</div>
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
            </div>
          </div>
          <div slot="footer">
            <div class="buttons">
              ${repeat(
                (dialogSettingsByType as any)[this.config.type as any].buttons,
                ({ action, variant = 'default', autofocus }, idx) => {
                  const onClick = () => {
                    this._lastClickedAction = action;

                    if (action === 'cancel') {
                      this._cancelForm();
                    } else {
                      const form = this.querySelector('form');

                      if (form && form.reportValidity()) {
                        form.submit();
                      }
                    }
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
        </sl-dialog>
      </div>
    `;
  }
}

function textToResultTemplate(
  text: string | null | undefined
): TemplateResult | null {
  if (!text) {
    return null;
  }

  const lines = text
    .split(/\n\r?/gm) //
    .map((it) => it.replace(/^\s+/, (it) => ''.padStart(it.length, '\u2000')));

  return html`${repeat(lines, (line) => html`${line}<br />`)}`;
}
