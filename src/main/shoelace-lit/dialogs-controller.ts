import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { LocalizeController } from '../shoelace/i18n/i18n';
import type { ReactiveControllerHost, TemplateResult } from 'lit';
import { AbstractDialogsCtrl } from '../shared/dialogs';
import type { DialogConfig } from '../shared/dialogs';

// components
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// icons
import infoIcon from '../shoelace/icons/info-circle.icon';
import successIcon from '../shoelace/icons/info-circle.icon';
import warningIcon from '../shoelace/icons/exclamation-circle.icon';
import errorIcon from '../shoelace/icons/exclamation-triangle.icon';
import confirmationIcon from '../shoelace/icons/question-circle.icon';
import approvalIcon from '../shoelace/icons/question-diamond.icon';
import promptIcon from '../shoelace/icons/keyboard.icon';
import inputIcon from '../shoelace/icons/window.icon';

// styles
import dialogsStyles from './dialogs.styles';

// === types =========================================================

type ExtraInputConfigParams = {
  labelLayout?: 'vertical' | 'horizontal' | 'auto';
};

// === icons of dialog types =========================================

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

export class DialogsController extends AbstractDialogsCtrl<
  TemplateResult,
  ExtraInputConfigParams
> {
  readonly #host: ReactiveControllerHost & HTMLElement;
  readonly #localize: LocalizeController;
  readonly #dialogs = new Set<TemplateResult>();

  static {
    // required components (just to prevent too much tree shaking)
    void [SlButton, SlDialog, SlIcon, SlInput];
  }

  constructor(host: ReactiveControllerHost & HTMLElement) {
    super((init) => this.#showDialog(init));
    this.#host = host;
    this.#localize = new LocalizeController(host);
  }

  render(): TemplateResult {
    return html` ${repeat(this.#dialogs, (dialog) => dialog)} `;
  }

  #showDialog = <R = void>(
    init: (
      translate: (key: string) => string
    ) => DialogConfig<TemplateResult, R>
  ): Promise<R> => {
    let lastClickedButton: number = -1;
    let emitResult: (result: any) => void;
    let content: TemplateResult | null = null;

    const translate = (key: string) =>
      this.#localize.term(`shoelaceWidgets.dialogs/${key}`);

    const config = init(translate);

    const hasPrimaryButton = config.buttons.some(
      (it) => it.variant === 'primary'
    );

    if (config.type === 'prompt') {
      const value = config.value === 'string' ? config.value : '';

      content = html`
        <sl-input name="input" size="small" autofocus value=${value}>
        </sl-input>
      `;
    } else if (config.type === 'input') {
      content = (config as any).content;
    }

    const onFormSubmit = (ev: SubmitEvent) => {
      ev.preventDefault();

      const formData = new FormData(ev.target as HTMLFormElement);
      const data: Record<string, string> = {};

      formData.forEach((value: FormDataEntryValue, key: string) => {
        data[key] = value.toString();
      });

      setTimeout(() => {
        data.button = lastClickedButton.toString();
        emitResult(config.mapResult?.(data));
        console.log('submit', lastClickedButton, data);
      });
    };

    const output = html`
      <style>
        ${dialogsStyles}
      </style>
      <form
        class=${classMap({
          'form': true,
          'label-layout-horizontal': true
          //(config as any).labelLayout === 'horizontal'
        })}
        dir=${this.#localize.dir()}
        @submit=${onFormSubmit}
      >
        <sl-dialog open class="dialog">
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
              };

              return html` <sl-button
                type="submit"
                variant=${variant}
                value=${idx}
                class="button"
                ?autofocus=${autofocus}
                @click=${onClick}
                >${text}</sl-button
              >`;
            })}
          </div>
        </sl-dialog>
      </form>
    `;

    this.#dialogs.add(output);
    this.#host.requestUpdate();

    return new Promise((resolve) => {
      emitResult = (result: any) => {
        setTimeout(() => resolve(result), 50);
      };
    });
  };
}
