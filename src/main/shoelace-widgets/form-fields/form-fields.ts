import type { ReactiveControllerHost } from 'lit';

export { Validators };
export type { FormField, Validator };

// === exports =================================================================

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

type Validator<T> = (value: T) => string | null;

// === local constants ===============================================

const regexEmail =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// === controllers ===================================================

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
