import { FormControlController } from '@shoelace-style/shoelace/dist/internal/form';
import type { FormField, Validator } from './form-fields';

export { FormFieldController };

class FormFieldController<V extends string | string[], W> {
  #formField: FormField<V>;
  #formControlController: FormControlController;
  #getDefaultValue: () => W;
  #setValue: (value: W) => void;
  #suppressError = true;
  #validation: Validator<V> | Validator<V>[] | null = null;
  #errorMsg = '';

  constructor(
    formField: FormField<V>,
    config: {
      getDefaultValue: () => W;
      setValue: (value: W) => void;
      validation?: Validator<V> | Validator<V>[];
    }
  ) {
    this.#formField = formField;
    this.#getDefaultValue = config.getDefaultValue;
    this.#setValue = config.setValue;
    this.#validation = config.validation ?? null;

    // TODO!!!
    this.#formControlController = new FormControlController(
      formField as unknown as any,
      {
        name: () => formField.name,
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
        value: () => formField.value
      }
    );
  }

  suppressError(value: boolean) {
    if (this.#suppressError !== value) {
      this.#suppressError = value;
      this.#formField.requestUpdate();
    }
  }

  hasError() {
    return !this.#suppressError && !!this.#errorMsg;
  }

  getErrorMessage() {
    return this.#errorMsg;
  }

  checkValidity() {
    if (this.#validation !== null) {
      const oldErrorMsg = this.#errorMsg;
      const value = this.#formField.value;

      const validation = Array.isArray(this.#validation)
        ? this.#validation
        : [this.#validation];

      for (const validate of validation) {
        const error = validate(value);
        const errorMsg = error ?? '???';

        if (error !== null) {
          this.#errorMsg = errorMsg;

          if (errorMsg !== oldErrorMsg && !this.#suppressError) {
            this.#formField.requestUpdate();
          }

          return false;
        }
      }

      if (oldErrorMsg !== '') {
        this.#errorMsg = '';

        if (!this.#suppressError) {
          this.#formField.requestUpdate();
        }
      }
    }

    return true;
  }

  submit() {
    this.#formControlController.submit();
  }

  reset() {
    this.#formControlController.reset();
  }
}
