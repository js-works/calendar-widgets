import { FormSubmitController } from './form-submit-controller';
import type { FormSubmitControllerOptions } from './form-submit-controller';
import type { FormControl } from '../misc/forms';

export { FormFieldController };

namespace FormFieldController {
  export interface Options {
    getForm: (input: FormControl) => HTMLFormElement | null;
    getName: (input: FormControl) => string;
    getValue: (input: FormControl) => unknown;
    getDefaultValue: (input: FormControl) => unknown;
    getDisabled: (input: FormControl) => boolean;

    getReportValidity: (input: FormControl) => boolean;
    setValue: (input: FormControl, value: unknown) => void;
  }
}

class FormFieldController extends FormSubmitController {
  constructor(
    host: FormControl,
    options?: Partial<FormFieldController.Options>
  ) {
    super(host, options);
  }
}
