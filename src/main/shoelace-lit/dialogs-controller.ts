import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { createRef, ref } from 'lit/directives/ref';
import { repeat } from 'lit/directives/repeat';

import {
  getAnimation,
  setDefaultAnimation
} from '@shoelace-style/shoelace/dist/utilities/animation-registry';

import { LocalizeController } from '../shoelace/i18n/i18n';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { AbstractDialogsController } from '../shared/dialogs';
import type { DialogConfig } from '../shared/dialogs';
import type { FormSubmitEvent } from '../shoelace/events/form-submit-event';

// components
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { Form } from '../shoelace/components/form/form';
import { TextField } from '../shoelace/components/text-field/text-field';

// icons
import infoIcon from '../shoelace/icons/bootstrap/info-circle.icon';
import successIcon from '../shoelace/icons/bootstrap/check-circle.icon';
import warningIcon from '../shoelace/icons/bootstrap/exclamation-circle.icon';
import errorIcon from '../shoelace/icons/bootstrap/exclamation-triangle.icon';
import confirmationIcon from '../shoelace/icons/bootstrap/question-circle.icon';
import approvalIcon from '../shoelace/icons/bootstrap/question-diamond.icon';
import promptIcon from '../shoelace/icons/bootstrap/keyboard.icon';
import inputIcon from '../shoelace/icons/bootstrap/layers.icon';

// styles
import dialogsStyles from './dialogs.styles';

// === types =========================================================

type ExtraInputConfigParams = {
  labelLayout?: 'vertical' | 'horizontal' | 'auto';
};

// === constants =====================================================

const toastDuration = 2000;

// === icons by dialog type ==========================================

const icons = {
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon,
  confirmation: confirmationIcon,
  approval: approvalIcon,
  prompt: promptIcon,
  input: inputIcon
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
  options: { duration: 600, easing: 'ease-out' }
});

export class DialogsController extends AbstractDialogsController<
  TemplateResult,
  ExtraInputConfigParams
> {
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
    console.log('Rendering ' + this.#dialogRenderers.size + ' renderers');
    return html`${repeat(this.#dialogRenderers, (it) => it())}`;
  }

  #showDialog = async <R = void>(
    config: DialogConfig<TemplateResult, R>
  ): Promise<R> => {
    let emitResult: (result: unknown) => void;
    let open = false;

    const renderer = () =>
      this.#renderDialog(
        config,
        open,
        () => {
          this.#dialogRenderers.delete(renderer);
        },
        (result) => {
          return emitResult(result);
        }
      );

    this.#dialogRenderers.add(renderer);

    await this.#requestUpdate();
    open = true;
    await this.#requestUpdate();

    return new Promise((resolve) => {
      emitResult = (result: any) => {
        setTimeout(() => resolve(result), 50);
      };
    });
  };

  #renderDialog<R = void>(
    config: DialogConfig<TemplateResult, R>,
    open: boolean,
    dismissDialog: () => void,
    emitResult: (result: unknown) => void
  ) {
    const formRef = createRef<Form>();
    const alertRef = createRef<SlAlert>();
    let lastClickedAction = '';

    const hasPrimaryButton = config.buttons.some(
      (it) => it.variant === 'primary'
    );

    let content: TemplateResult | null = null;

    if (config.type === 'prompt') {
      const value = config.params.value === 'string' ? config.params.value : '';

      content = html`
        <sx-text-field name="input" size="small" autofocus value=${value}>
        </sx-text-field>
      `;
    } else if (config.type === 'input') {
      content = (config as any).content;
    }

    const onFormSubmit = (ev: FormSubmitEvent) => {
      ev.preventDefault();
      const data = { ...ev.detail.data };

      setTimeout(() => {
        data.action = lastClickedAction;
        dialogRef.value!.hide();
        emitResult(config.mapResult?.(lastClickedAction, data));
      });
    };

    const onFormInvalid = async () => {
      const alertElem = alertRef.value!;

      if (alertElem.open) {
        const { keyframes, options } = getAnimation(
          alertElem,
          'shoelaceWidgets.dialogs.vibrate',
          {
            dir: this.#localize.dir()
          }
        );

        ++alertElem.duration;
        alertElem.requestUpdate();
        await alertElem.updateComplete;
        alertElem.duration = toastDuration;
        alertElem.requestUpdate();
        await alertElem.updateComplete;

        alertElem
          .shadowRoot!.querySelector('[part=base]')!
          .animate(keyframes, options);
      } else {
        alertElem.toast();
      }
    };

    const labelLayout =
      config.type !== 'input'
        ? 'auto'
        : config.params.labelLayout === 'vertical'
        ? 'vertical'
        : config.params.labelLayout === 'horizontal'
        ? 'horizontal'
        : 'auto';

    const dialogRef = createRef<SlDialog>();

    const onAfterHide = (ev: Event) => {
      if (ev.currentTarget === dialogRef.value) {
        dismissDialog();
        console.log('dialog dismissed');
      }
    };

    return html`
      <style>
        ${dialogsStyles}
      </style>
      <sx-form
        class=${classMap({
          'form': true,
          'label-layout-vertical': labelLayout === 'vertical',
          'label-layout-horizontal': labelLayout === 'horizontal'
        })}
        dir=${this.#localize.dir()}
        @sx-form-submit=${onFormSubmit}
        @sx-form-invalid=${onFormInvalid}
        ${ref(formRef)}
      >
        <sl-dialog
          ?open=${open}
          class="dialog"
          style="--width: ${config.width ?? 'initial'}"
          @sl-after-hide=${onAfterHide}
          ${ref(dialogRef)}
        >
          <div slot="label" class="header">
            <sl-icon
              class="icon ${config.type}"
              src=${icons[config.type]}
            ></sl-icon>
            <div class="title">${config.title}</div>
          </div>
          <div class="message">${config.message}</div>
          <div class="content">${content}</div>
          <div slot="footer">
            <div
              class=${classMap({
                'error-box': true,
                'error-box--closed': true
              })}
            >
              <div class="error-box-content">
                <sl-icon
                  src=${errorIcon}
                  class="error-box-error-icon"
                ></sl-icon>
                <div class="error-box-text">
                  Invalid form entries - please correct
                </div>
                <sl-icon
                  class="error-box-close-icon"
                  library="system"
                  name="x"
                ></sl-icon>
              </div>
            </div>
            <div class="buttons">
              ${repeat(
                config.buttons,
                ({ text, action, variant = 'default' }, idx) => {
                  const autofocus =
                    variant === 'primary' || (!hasPrimaryButton && idx === 0);

                  const onClick = () => {
                    lastClickedAction = action;
                    formRef.value!.submit();
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
