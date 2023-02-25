import { LitElement } from 'lit';
export { Validators };
export type { FormField, Validator };

interface FormField<V extends string | string[]> extends LitElement {
  form: string;
  name: string;
  value: V;
  disabled: boolean;
  required: boolean;

  validationMessage: string;
  validity: ValidityState;

  checkValidity(): boolean;
  reportValidity(): boolean;
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
