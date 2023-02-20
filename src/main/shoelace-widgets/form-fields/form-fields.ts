import { LitElement, ReactiveController } from 'lit';
import { getPluginOption } from '../misc/plugins';

export { FormField, Validators };
export type { Validator };

// === exports =================================================================

abstract class FormField<V extends string | string[]> extends LitElement {
  constructor() {
    super();

    const onComponentInit = getPluginOption('onComponentInit');

    if (onComponentInit) {
      let isInitialized = false;

      const controller: ReactiveController = {
        hostConnected: () => {
          this.removeController(controller);

          if (!isInitialized) {
            isInitialized = true;
            onComponentInit(this);
          }
        }
      };

      this.addController(controller);
    }

    const mapper = getPluginOption('componentContentMapper');

    if (mapper) {
      const render = this.render;
      this.render = () => mapper(render.call(this), this);
    }
  }

  abstract form: string;
  abstract name: string;
  abstract value: V;
  abstract disabled: boolean;
  abstract required: boolean;

  abstract validationMessage: string;
  abstract validity: ValidityState;

  abstract checkValidity(): boolean;
  abstract reportValidity(): boolean;
}

type Validator<T> = (value: T) => string | null;

// === local constants ===============================================

const regexEmail =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// === controllers ===================================================

const Validators = {
  required: createValidatorFactory(
    (isSatisfied?: (value: unknown) => boolean) =>
      (value): string | null => {
        let valid = isSatisfied ? !!isSatisfied(value) : !!value;

        return valid ? null : 'Field is mandatory'; // TODO!!!
      }
  ),

  email: createValidatorFactory(() => (value): string | null => {
    let valid = typeof value === 'string' && regexEmail.test(value);

    return valid ? null : 'Invalid email address'; // TODO!!!
  })
};

function createValidatorFactory<T, F extends (...args: any[]) => Validator<T>>(
  fn: F
): F {
  return fn;
}
