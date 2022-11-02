import type { ReactiveControllerHost } from 'lit';
import { FormFieldEvent } from '../events/form-field-event';

import {
  runCloseVerticalTransition,
  runOpenVerticalTransition
} from '../misc/transitions';

// === exports =======================================================

export { FormFieldController, Validators };
export type { Validator };

// === exported types ================================================

type Validator<T> = (value: T) => string | null;

// === local constants ===============================================

const regexEmail =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const noop = () => {};

// === controllers ===================================================

class FormFieldController<T> {
  #sendSignal: (type: FormFieldEvent.SignalType) => void = noop;
  #getValue: () => T;
  #validation: Validator<T>[];
  #errorMsg: string | null = null;
  #errorMsgDiv = document.createElement('div');

  constructor(
    component: ReactiveControllerHost & HTMLElement & { name: string },

    params: {
      getValue: () => T;

      validation: Validator<T> | Validator<T>[];
    }
  ) {
    let hasInitialized = false;
    this.#getValue = params.getValue;
    this.#validation = [params.validation].flat();

    component.addController({
      hostDisconnected: () => {
        hasInitialized = false;
        this.#sendSignal('cancel');
      },

      hostUpdate: () => {
        if (hasInitialized) {
          return;
        }

        hasInitialized = true;

        const formFieldEvent = new CustomEvent<FormFieldEvent.Detail>(
          'sx-form-field',
          {
            bubbles: true,
            composed: true,

            detail: {
              element: component,
              getName: () => component.name || '',
              getValue: this.#getValue,
              validate: () => this.validate(),

              setErrorMsg: (errorMsg) => {
                if (errorMsg === this.#errorMsg) {
                  return;
                }

                this.#errorMsg = errorMsg;

                if (errorMsg) {
                  this.#errorMsgDiv.innerHTML = '';
                  const innerDiv = document.createElement('div');
                  innerDiv.innerText = errorMsg;
                  this.#errorMsgDiv.append(innerDiv);
                  innerDiv.className = 'validation-error';
                  this.#errorMsgDiv.style.maxHeight = '0';
                  this.#errorMsgDiv.style.overflow = 'hidden';

                  runOpenVerticalTransition(this.#errorMsgDiv).then(() => {
                    this.#errorMsgDiv.style.maxHeight = 'none';
                    this.#errorMsgDiv.style.overflow = 'auto';
                  });
                } else {
                  runCloseVerticalTransition(this.#errorMsgDiv).then(() => {
                    this.#errorMsgDiv.style.maxHeight = '0';
                    this.#errorMsgDiv.style.overflow = 'hidden';
                    this.#errorMsgDiv.innerHTML = '';
                  });
                }

                component.requestUpdate();
              },

              setSendSignal: (sendSignal) => {
                this.#sendSignal = sendSignal;
              }
            }
          }
        );

        component.dispatchEvent(formFieldEvent);
      }
    });
  }

  readonly signalInput = () => this.#sendSignal!('input');
  readonly signalChange = () => this.#sendSignal!('change');
  readonly signalFocus = () => this.#sendSignal!('focus');
  readonly signalBlur = () => this.#sendSignal!('blur');
  readonly signalSubmit = () => this.#sendSignal!('submit');

  getValidationMode(): 'default' | 'inline' {
    return 'default';
  }

  getShownErrorMsg(): string | null {
    return this.#errorMsg;
  }

  showsError() {
    return this.#errorMsg !== null;
  }

  ifErrorShown<T>(fn: (errorMsg: string) => T): T | null {
    if (this.#errorMsg === null) {
      return null;
    }

    return fn(this.#errorMsg);
  }

  renderErrorMsg(): HTMLElement | null {
    return this.#errorMsgDiv;
  }

  validate = (): string | null => {
    for (const validator of this.#validation) {
      const errorMsg = validator(this.#getValue());

      if (errorMsg !== null) {
        return errorMsg;
      }
    }

    return null;
  };
}

const Validators = {
  required: createValidatorFactory(
    (isSatisfied?: (value: unknown) => boolean) => (value) => {
      let valid = isSatisfied ? !!isSatisfied(value) : !!value;

      return valid ? null : 'Field is mandatory'; // TODO!!!
    }
  ),

  email: createValidatorFactory(() => (value) => {
    let valid = typeof value === 'string' && regexEmail.test(value);

    return valid ? null : 'Invalid email address'; // TODO!!!
  })
};

function createValidatorFactory<T, F extends (...args: any[]) => Validator<T>>(
  fn: F
): F {
  return fn;
}
