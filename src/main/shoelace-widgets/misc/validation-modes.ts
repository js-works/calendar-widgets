import {
  FormControlController,
  FormControlControllerType
} from '../misc/form-control-controller';

let patched = false;
let styleElem: HTMLStyleElement | null = null;

export function setValidationMode(
  mode: 'default' | 'inline' | 'inline/animated'
) {
  if (!patched) {
    patchFormControlController();
    patched = true;
  }

  if (!styleElem) {
    styleElem = document.createElement('style');
    document.head.append(styleElem);
  }

  styleElem.innerText = `
    :root {
      --validation-mode: ${mode};
    }
  `;
}

function patchFormControlController() {
  // we have to monkey patch
  const proto: FormControlControllerType = (FormControlController as any)
    .prototype;
  const oldHostConnectedFn = proto.hostConnected;
  const oldAttachFormFn = (proto as any).attachForm;

  proto.hostConnected = function () {
    oldHostConnectedFn.apply(this);

    this.host.addEventListener('sl-input', () => {
      updateValidationMessage(this.host);
    });

    this.host.parentElement!.addEventListener(
      'sl-invalid',
      (ev: Event) => {
        const validationMode = getComputedStyle(this.host).getPropertyValue(
          '--validation-mode'
        );

        if (validationMode !== 'inline') {
          return;
        }

        (this as any).setUserInteracted(this.host, true);
        updateValidationMessage(this.host);
        console.log('!!!!!invalid!!!!!', validationMode);

        ev.preventDefault();
      },
      true
    );
  };

  (proto as any).attachForm = function (formControl: any) {
    oldAttachFormFn.call(this, formControl);
    console.log('attachForm', formControl);
  };
}

// Updates the error data attribute of a given Shoelace form control,
// depending on the form control's `validationMessage` property
const updateValidationMessage = (formControl: any) => {
  const message = formControl.validationMessage;
  const root = formControl.shadowRoot;
  const lastChild = root.lastChild;
  const baseElem = root.querySelector('[part=form-control], .base');
  let validationMessagePart: HTMLElement;

  if (
    lastChild instanceof HTMLElement &&
    lastChild.getAttribute('id') === 'form-control-validation-message'
  ) {
    validationMessagePart = lastChild;
  } else {
    console.log(lastChild);
    validationMessagePart = document.createElement('div');

    validationMessagePart.setAttribute('id', 'form-control-validation-message');

    const styleElem = document.createElement('style');
    styleElem.innerText = validationMessageStyles;

    root.append(styleElem, validationMessagePart);
  }

  if (validationMessagePart.innerText !== message) {
    validationMessagePart.innerText = message;
  }

  /*
    if (message === '') {
      formControlPart.removeAttribute('aria-errormessage');
    } else {
      formControlPart.setAttribute(
        'aria-errormessage',
        'form-control-validation-message'
      );
    }
    */
};

const validationMessageStyles = `
  #form-control-validation-message {
    display: none;
  }

  :host([data-user-invalid]) #form-control-validation-message {
    display: block;
    color: var(--sl-color-danger-700);
    font-size: var(--sl-font-size: medium);
    margin-left: calc(var(--label-width) + var(--gap-width));
    padding-top: 0.25em;
  }
  
  :host([data-user-invalid]) #form-control-validation-message::before {
    content: '\u26a0 ';
    font-family: monospace;
  }
`;
