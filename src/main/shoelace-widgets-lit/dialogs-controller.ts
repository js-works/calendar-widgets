import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { styleMap } from 'lit/directives/style-map';
import { createRef, ref } from 'lit/directives/ref';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';

import {
  getAnimation,
  setDefaultAnimation
} from '@shoelace-style/shoelace/dist/utilities/animation-registry';

import { LocalizeController } from '../shoelace-widgets/i18n/i18n';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { AbstractDialogsController } from '../shoelace-widgets/controllers/vanilla/dialogs';
import type { DialogConfig } from '../shoelace-widgets/controllers/vanilla/dialogs';
import type { FormSubmitEvent } from '../shoelace-widgets/events/form-submit-event';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { Form } from '../shoelace-widgets/components/form/form';
import { TextField } from '../shoelace-widgets/components/text-field/text-field';

// icons
import infoIcon from '../shoelace-widgets/icons/bootstrap/info-square.icon';
import successIcon from '../shoelace-widgets/icons/bootstrap/check2-square.icon';
import warningIcon from '../shoelace-widgets/icons/bootstrap/exclamation-diamond.icon';
import errorIcon from '../shoelace-widgets/icons/bootstrap/exclamation-triangle.icon';
import confirmationIcon from '../shoelace-widgets/icons/bootstrap/question-diamond.icon';
import approvalIcon from '../shoelace-widgets/icons/bootstrap/question-diamond.icon';
import promptIcon from '../shoelace-widgets/icons/bootstrap/keyboard.icon';

// styles
import dialogsStyles from './dialogs.styles';

// === types =========================================================

// === icons by dialog type ==========================================

const icons = {
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon,
  confirmation: confirmationIcon,
  approval: approvalIcon,
  prompt: promptIcon,
  input: null
};

// === animations ====================================================

setDefaultAnimation('shoelaceWidgets.dialogs.vibrate', {
  keyframes: [
    { transform: 'scale(1)' },
    { transform: 'scale(0.95)' },
    { transform: 'scale(1)' },
    { transform: 'scale(0.95)' },
    { transform: 'scale(1)' }
  ],
  options: { duration: 600, easing: 'ease-in-out' }
});

@customElement('dyn-dialog')
class DynDialog extends LitElement {
  @property({ attribute: false })
  config!: DialogConfig<unknown, unknown>;

  @property({ attribute: false })
  dismissDialog!: () => void;

  @property({ attribute: false })
  emitResult!: (result: unknown) => void;

  @property()
  lang: string = '';

  @property()
  dir: string = '';

  @state()
  private _dialogOpen = false;

  private _localize = new LocalizeController(this);
  private _dialogRef = createRef<SlDialog>();
  private _formRef = createRef<Form>();

  private _lastClickedAction = '';

  private _onFormSubmit = (ev: FormSubmitEvent) => {
    ev.preventDefault();
    const data = { ...ev.detail.data };

    setTimeout(async () => {
      data.action = this._lastClickedAction;
      await this._dialogRef.value!.hide();
      this.emitResult(this.config.mapResult?.(this._lastClickedAction, data));
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
    let additionalContent: TemplateResult = html``;

    const hasPrimaryButton = this.config.buttons.some(
      (it) => it.variant === 'primary'
    );

    if (this.config.type === 'prompt') {
      const value =
        this.config.params.value === 'string' ? this.config.params.value : '';

      additionalContent = html`
        <sx-text-field name="input" size="small" autofocus value=${value}>
        </sx-text-field>
      `;
    }

    const labelLayout =
      this.config.type !== 'input'
        ? 'auto'
        : this.config.params.labelLayout === 'vertical'
        ? 'vertical'
        : this.config.params.labelLayout === 'horizontal'
        ? 'horizontal'
        : 'auto';

    const dialogRef = createRef<SlDialog>();

    const onAfterHide = (ev: Event) => {
      if (ev.target === dialogRef.value) {
        this.dismissDialog();
      }
    };

    return html`
      <style>
        .dialog {
          --width: ${this.config.width ?? 'initial'}
        }

        .dialog::part(panel) {
          height: ${this.config.height ? this.config.height : 'auto'}
        }

        ${dialogsStyles}
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
          ?opTODOen=${this._dialogOpen}
          open
          class=${classMap({
            dialog: true,
            [`dialog--${this.config.type}`]: true
          })}
          @sl-after-hide=${onAfterHide}
          ${ref(dialogRef)}
        >
          <div slot="label" class="header">
            ${when(
              icons[this.config.type],
              () => html` <sl-icon
                class="icon ${this.config.type}"
                src=${icons[this.config.type]}
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
                  typeof this.config.message === 'function'
                    ? this.config.message()
                    : this.config.message
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
                this.config.buttons,
                ({ text, action, variant = 'default' }, idx) => {
                  const autofocus =
                    variant === 'primary' || (!hasPrimaryButton && idx === 0);

                  const onClick = () => {
                    this._lastClickedAction = action;
                    this._formRef.value!.submit();
                  };

                  return html`
                    <sl-button
                      type="submit"
                      variant=${variant}
                      value=${idx}
                      class="button"
                      ?autofocus=${autofocus}
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
      </sx-form>
    `;
  }
}

export class DialogsController extends AbstractDialogsController<TemplateResult> {
  static {
    // required components (just to prevent too much tree shaking)
    void [Form, TextField, SlAlert, SlButton, SlDialog, SlIcon, SlInput];
  }

  readonly #requestUpdate: () => Promise<boolean>;
  readonly #localize: LocalizeController;
  readonly #dialogRenderers = new Set<() => TemplateResult>();

  constructor(host: ReactiveControllerHost & HTMLElement) {
    super({
      translate: (key) => this.#localize.term(`shoelaceWidgets.dialogs/${key}`),
      showDialog: (config) => this.#showDialog(config)
    });

    this.#localize = new LocalizeController(host);

    this.#requestUpdate = () => {
      host.requestUpdate();
      return host.updateComplete;
    };
  }

  render(): TemplateResult {
    return html`${repeat(this.#dialogRenderers, (it) => it())}`;
  }

  #showDialog = async <R = void>(
    config: DialogConfig<TemplateResult, R>
  ): Promise<R> => {
    let emitResult: (result: unknown) => void;

    const renderer = () =>
      html`
        <dyn-dialog
          .config=${config}
          .dismissDialog=${() => {
            this.#dialogRenderers.delete(renderer);
            this.#requestUpdate();
          }}
          .emitResult=${(result: any) => {
            return emitResult(result);
          }}
        >
          ${config.content}
        </dyn-dialog>
      `;

    this.#dialogRenderers.add(renderer);

    await this.#requestUpdate();
    // dialogOpen = true;
    await this.#requestUpdate();

    return new Promise((resolve) => {
      emitResult = (result: any) => {
        setTimeout(() => resolve(result), 50);
      };
    });
  };
}

function textToResultTemplate(text: string | null): TemplateResult | null {
  if (!text) {
    return null;
  }

  const lines = text.split(/$/gm);

  return html`${repeat(lines, (line) => html`${line}<br />`)}`;
}
