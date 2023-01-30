import { FormControlController } from '@shoelace-style/shoelace/dist/internal/form';
import type { FormField } from './form-fields';

export { FormFieldController };

class FormFieldController<V extends string | string[], W> {
  #formField: FormField<V>;
  #formControlController: FormControlController;
  #getDefaultValue: () => W;
  #setValue: (value: W) => void;
  #suppressError = true;

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
  }

  suppressError(value: boolean) {
    if (this.#suppressError !== value) {
      this.#suppressError = value;
      this.#formField.requestUpdate();
    }
  }

  hasError() {
    return !this.#suppressError;
  }

  getErrorMessage() {
    return 'Please enter this field';
  }

  checkValidity() {
    console.log('checkValidity');
    return false;
  }

  submit() {
    this.#formControlController.submit();
  }

  reset() {
    this.#formControlController.reset();
  }
}
