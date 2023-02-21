import { LitElement, ReactiveController } from 'lit';
import { makePluginable } from '../misc/plugins';

export { FormField as FormField, Validators };
export type { Validator };

abstract class FormField<V extends string | string[]> extends LitElement {
  constructor() {
    super();
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

makePluginable(FormField as unknown as any);

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
