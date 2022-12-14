import type { ReactiveControllerHost } from 'lit';
export type { FormControl };

interface FormControl extends ReactiveControllerHost, HTMLElement {
  name: string;
  value: unknown;
  disabled: boolean;
  defaultValue: unknown;
  // invalid: boolean;
  required: boolean;

  checkValidity: () => boolean;
  reportValidity: () => boolean;
  setCustomValidity: (message: string) => void;
}
