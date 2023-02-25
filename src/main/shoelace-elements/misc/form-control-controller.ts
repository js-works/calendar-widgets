import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { FormControlController as FormControlControllerType } from '@shoelace-style/shoelace/dist/internal/form';

const constructor = Object.values(new SlInput()).find(
  (it) => it && typeof it === 'object' && 'updateValidity' in it
).constructor;

const FormControlController: FormControlControllerType = constructor;

export { FormControlController };
