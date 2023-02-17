import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { FormFieldController } from '../form-fields/form-field-controller';
import type { FormControlController as FormControlControllerType } from '@shoelace-style/shoelace/dist/internal/form';

export { FormControlController, FormControlControllerType };

const slInput = new SlInput();
const values = Object.values(slInput);

let formControlController = null as any;

for (const value of values) {
  if (value && value.updateValidity) {
    formControlController = value;
  }
}

const FormControlController: FormControlControllerType =
  formControlController.constructor;
