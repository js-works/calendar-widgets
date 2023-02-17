import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import type { FormControlController as FormControlControllerType } from '@shoelace-style/shoelace/dist/internal/form';

const slInput = new SlInput();
const values = Object.values(slInput);

let formControlController = null as any;

for (const value of values) {
  if (value && value.updateValidity) {
    formControlController = value;
  }
}

export const FormControlController: FormControlControllerType =
  formControlController.constructor;
