import { html, LitElement, ReactiveControllerHost } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LocalizeController } from '../../i18n/i18n';
import { FormControlController } from '@shoelace-style/shoelace/dist/internal/form';

// custom elements
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/input/input';
import type SlInput from '@shoelace-style/shoelace/dist/components/input/input';

interface FormField<V extends string | string[]>
  extends HTMLElement,
    ReactiveControllerHost {
  form: string;
  name: string;
  value: V;
  disabled: boolean;
  required: boolean;

  checkValidity: () => boolean;
  reportValidity: () => boolean;
  setCustomValidity: (message: string) => void;
}

class FormFieldController<V extends string | string[], W> {
  #formField: FormField<V>;
  #formControlController: FormControlController;
  #getDefaultValue: () => W;
  #setValue: (value: W) => void;

  constructor(
    formField: FormField<V>,
    config: {
      getDefaultValue: () => W;
      setValue: (value: W) => void;
    }
  ) {
    this.#formField = formField;
    this.#getDefaultValue = config.getDefaultValue;
    this.#setValue = config.setValue;

    // TODO!!!
    this.#formControlController = new FormControlController(
      formField as unknown as any,
      {
        name: () => formField.name + 'xxx',
        defaultValue: () => this.#setValue(this.#getDefaultValue()),
        setValue: (_, value) => this.#setValue(value as W),
        disabled: () => formField.disabled,
        form: () => {
          // If there's a form attribute, use it to find the target form by id
          if (
            formField.hasAttribute('form') &&
            formField.getAttribute('form') !== ''
          ) {
            const root = formField.getRootNode() as Document | ShadowRoot;
            const formId = formField.getAttribute('form');

            if (formId) {
              return root.getElementById(formId) as HTMLFormElement;
            }
          }

          return formField.closest('form');
        },

        reportValidity: () => formField.reportValidity(),
        value: () => formField.value + 'aaaa'
      }
    );

    formField.addController({
      hostConnected() {
        formField.addEventListener('formdata', (ev) => {
          alert('x');
          ev.stopPropagation();
        });
      }
    });
  }

  submit() {
    this.#formControlController.submit();
  }

  reset() {
    this.#formControlController.reset();
  }
}

// styles
import textFieldStyles from './text-field.styles';

// === exports =======================================================

export { TextField };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-text-field': TextField;
  }
}

// === TextField =====================================================

@customElement('sx-text-field')
class TextField extends LitElement implements FormField<string> {
  static styles = textFieldStyles;

  @property()
  form = '';

  @property()
  type: 'text' | 'password' | 'email' | 'phone' | 'cellphone' = 'text';

  @property()
  name = '';

  @property()
  value = '';

  @property()
  defaultValue = '';

  @property()
  label = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean, reflect: true })
  autofocus = false;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  private _slInputRef = createRef<SlInput>();
  private _localize = new LocalizeController(this);

  private _formFieldCtrl = new FormFieldController(this, {
    getDefaultValue: () => this.defaultValue,
    setValue: (value: string) => (this.value = value)
  });

  focus() {
    this._slInputRef.value!.focus();
  }

  blur(): void {
    this._slInputRef.value?.blur();
  }

  get invalid() {
    return false;
  }

  emit(): CustomEvent {
    return null as any; // TODO
  }

  protected override firstUpdated() {
    Object.defineProperty(this, 'value', {
      get: () => this._slInputRef.value!.value,
      set: (value: string) => void (this._slInputRef.value!.value = value)
    });
  }

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formFieldCtrl.submit());

  render() {
    const icon =
      this.type === 'email' ||
      this.type === 'phone' ||
      this.type === 'cellphone'
        ? `text-field.${this.type}`
        : null;

    return html`
      <div
        class="base ${classMap({
          required: this.required
          // invalid: this._formField.showsError()
        })}"
      >
        <sl-input
          type=${this.type === 'password' ? 'password' : 'text'}
          ?password-toggle=${this.type === 'password'}
          class="sl-control"
          size=${this.size}
          ${ref(this._slInputRef)}
          value=${this.value}
          ?autofocus=${this.autofocus}
          @keydown=${this._onKeyDown}
          ?required=${this.required}
          .label=${this.label}
        >
          ${when(
            this.label,
            () => html`
              <span
                slot="label"
                class=${classMap({
                  'sl-control-label': true,
                  'sl-control-label--required': this.required
                })}
              >
                ${this.label}
              </span>
            `
          )}
          ${when(
            icon,
            () =>
              html`<sl-icon
                slot="suffix"
                library="shoelace-widgets"
                name=${icon}
              ></sl-icon> `
          )}
        </sl-input>
        <!--
        {when(this._formField.getValidationMode() === 'inline', () =>
          this._formField.renderErrorMsg()
        )}
        -->
      </div>
    `;
  }

  checkValidity(): boolean {
    // alert('checkValidity');
    return true;
  }

  reportValidity(): boolean {
    //alert('reportValidity');
    return true;
  }

  setCustomValidity(msg: string) {
    //alert('setCustomValidity');
    //
  }
}
