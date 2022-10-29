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

import {
  runCloseVerticalTransition,
  runOpenVerticalTransition
} from '../shoelace/misc/transitions';

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
  options: { duration: 600, easing: 'ease-in-out' }
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
    let dialogOpen = false;
    let errorBoxVisible = false;

    const renderer = () =>
      this.#renderDialog(config, {
        isDialogOpen: () => dialogOpen,
        isErrorBoxVisible: () => errorBoxVisible,
        setErrorBoxVisible: (value: boolean) => {
          if (errorBoxVisible !== value) {
            errorBoxVisible = value;
            this.#requestUpdate();
          }
        },
        dismissDialog: () => {
          this.#dialogRenderers.delete(renderer);
          this.#requestUpdate();
        },
        emitResult(result) {
          return emitResult(result);
        }
      });

    this.#dialogRenderers.add(renderer);

    await this.#requestUpdate();
    dialogOpen = true;
    await this.#requestUpdate();

    return new Promise((resolve) => {
      emitResult = (result: any) => {
        setTimeout(() => resolve(result), 50);
      };
    });
  };

  #renderDialog<R = void>(
    config: DialogConfig<TemplateResult, R>,
    params: {
      isDialogOpen: () => boolean;
      isErrorBoxVisible: () => boolean;
      setErrorBoxVisible: (value: boolean) => void;
      dismissDialog: () => void;
      emitResult: (result: unknown) => void;
    }
  ) {
    const {
      isDialogOpen: isOpen,
      isErrorBoxVisible,
      setErrorBoxVisible,
      dismissDialog,
      emitResult
    } = params;

    const formRef = createRef<Form>();
    const errorBoxRef = createRef<HTMLDivElement>();
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

      setTimeout(async () => {
        data.action = lastClickedAction;
        await dialogRef.value!.hide();
        emitResult(config.mapResult?.(lastClickedAction, data));
      });
    };

    const onFormInvalid = async () => {
      if (isErrorBoxVisible()) {
        const { keyframes, options } = getAnimation(
          errorBoxRef.value!,
          'shoelaceWidgets.dialogs.vibrate',
          {
            dir: this.#localize.dir()
          }
        );

        errorBoxRef.value!.animate(keyframes, options);
      } else {
        runOpenVerticalTransition(errorBoxRef.value!).then(() =>
          setErrorBoxVisible(true)
        );
        this.#requestUpdate();
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
      if (ev.target === dialogRef.value) {
        dismissDialog();
        console.log('dialog dismissed');
      }
    };

    const onCloseErrorBoxClick = () => {
      runCloseVerticalTransition(errorBoxRef.value!).then(() =>
        setErrorBoxVisible(false)
      );

      this.#requestUpdate();
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
          ?open=${isOpen()}
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
                'error-box--closed': !isErrorBoxVisible()
              })}
              ${ref(errorBoxRef)}
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
                  @click=${onCloseErrorBoxClick}
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
