import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { createRef, ref } from 'lit/directives/ref';
import { repeat } from 'lit/directives/repeat';
import { LocalizeController } from '../shoelace/i18n/i18n';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { AbstractDialogsController } from '../shared/dialogs';
import type { DialogConfig } from '../shared/dialogs';
import { ToastsController } from '../shoelace-lit/toasts-controller';
import type { FormSubmitEvent } from '../shoelace/events/form-submit-event';

// components
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { Form } from '../shoelace/components/form/form';
import { TextField } from '../shoelace/components/text-field/text-field';

// icons
import infoIcon from '../shoelace/icons/info-circle.icon';
import successIcon from '../shoelace/icons/check-circle.icon';
import warningIcon from '../shoelace/icons/exclamation-circle.icon';
import errorIcon from '../shoelace/icons/exclamation-triangle.icon';
import confirmationIcon from '../shoelace/icons/question-circle.icon';
import approvalIcon from '../shoelace/icons/question-diamond.icon';
import promptIcon from '../shoelace/icons/keyboard.icon';
import inputIcon from '../shoelace/icons/layers.icon';

// styles
import dialogsStyles from './dialogs.styles';

// === types =========================================================

type ExtraInputConfigParams = {
  labelLayout?: 'vertical' | 'horizontal' | 'auto';
};

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

export class DialogsController extends AbstractDialogsController<
  TemplateResult,
  ExtraInputConfigParams
> {
  static {
    // required components (just to prevent too much tree shaking)
    void [Form, TextField, SlButton, SlDialog, SlIcon, SlInput];
  }

  readonly #requestUpdate: () => Promise<boolean>;
  readonly #localize: LocalizeController;
  readonly #toasts: ToastsController;
  readonly #dialogRenderers = new Set<() => TemplateResult>();

  constructor(host: ReactiveControllerHost & HTMLElement) {
    super({
      translate: (key) => this.#localize.term(`shoelaceWidgets.dialogs/${key}`),
      showDialog: (config) => this.#showDialog(config)
    });

    this.#localize = new LocalizeController(host);
    this.#toasts = new ToastsController(host);

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
    let open = false;

    const renderer = () =>
      this.#renderDialog(config, open, (result) => {
        this.#dialogRenderers.delete(renderer);
        return emitResult(result);
      });

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
    emitResult: (result: unknown) => void
  ) {
    const formRef = createRef<Form>();
    let lastClickedButton: number = -1;

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

      console.log(data);

      setTimeout(() => {
        data.button = lastClickedButton.toString();
        emitResult(config.mapResult?.(data));
      });
    };

    const onFormInvalid = () => {
      this.#toasts.error({
        message: 'Invalid form data',
        duration: 3000,
        closeable: true
      });
    };

    const labelLayout =
      config.type !== 'input'
        ? 'auto'
        : config.params.labelLayout === 'vertical'
        ? 'vertical'
        : config.params.labelLayout === 'horizontal'
        ? 'horizontal'
        : 'auto';

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
        <sl-dialog ?open=${open} class="dialog">
          <div slot="label" class="header">
            <sl-icon
              class="icon ${config.type}"
              src=${icons[config.type]}
            ></sl-icon>
            <div class="title">${config.title}</div>
          </div>
          <div class="message">${config.message}</div>
          <div class="content">${content}</div>
          <div slot="footer" class="buttons">
            ${repeat(config.buttons, ({ text, variant = 'default' }, idx) => {
              const autofocus =
                variant === 'primary' || (!hasPrimaryButton && idx === 0);

              const onClick = () => {
                lastClickedButton = idx;
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
            })}
          </div>
        </sl-dialog>
      </sx-form>
      ${this.#toasts.render()}
    `;
  }
}
