import {
  FormControlController,
  FormControlControllerType
} from '../misc/form-control-controller';

let patched = false;
let styleElem: HTMLStyleElement | null = null;

export function setValidationMode(mode: 'default' | 'inline') {
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

    if (this.host.matches('sx-fieldset *')) {
      this.host.addEventListener('sl-input', () => {
        updateValidationMessage(this.host);
      });

      this.form?.addEventListener(
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

          ev.preventDefault();
        },
        true
      );
    }
  };
}

// Updates the error data attribute of a given Shoelace form control,
// depending on the form control's `validationMessage` property
const updateValidationMessage = (formControl: any) => {
  const message = formControl.validationMessage;
  const root = formControl.shadowRoot;
  const lastChild = root.lastChild;
  const baseElem = root.querySelector('[part=form-control], .base');
  let validationMessageElem: HTMLElement;
  let externalContentElem: HTMLElement;

  if (
    lastChild instanceof HTMLElement &&
    lastChild.getAttribute('id') === '__external-content__'
  ) {
    externalContentElem = lastChild;
    validationMessageElem = lastChild.lastChild!.lastChild as HTMLElement;
  } else {
    externalContentElem = document.createElement('div');
    externalContentElem.setAttribute('id', '__external-content__');

    const styleElem = document.createElement('style');
    styleElem.innerText = validationMessageStyles;

    validationMessageElem = document.createElement('div');
    validationMessageElem.id = '__validation-message__';

    const validationIconElem = document.createElement('sl-icon');
    validationIconElem.id = '__validation-icon__';
    validationIconElem.src = exclamationIcon;

    const validationElem = document.createElement('div');
    validationElem.id = '__validation__';
    validationElem.append(validationIconElem, validationMessageElem);

    externalContentElem.append(styleElem, validationElem);

    root.append(externalContentElem);
  }

  if (validationMessageElem.innerText !== message) {
    if (message !== '') {
      validationMessageElem.innerText = message;

      openValidationMessage(externalContentElem).then(() => {
        externalContentElem.style.maxHeight = 'none';
        externalContentElem.style.overflow = 'auto';
      });
    } else {
      closeValidationMessage(externalContentElem).then(() => {
        externalContentElem.style.maxHeight = '0';
        externalContentElem.style.overflow = 'hidden';
        validationMessageElem.innerText = '';
      });
    }
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

function openValidationMessage(
  node: HTMLElement,
  duration = '0.25s',
  timing = 'linear'
): Promise<void> {
  const oldTransition = node.style.transition;
  const oldMaxHeight = node.style.maxHeight;
  const oldOverflow = node.style.overflow;

  node.style.transition = `max-height ${duration} ${timing}`;
  node.style.maxHeight = node.scrollHeight + 'px';
  node.style.overflow = 'hidden';

  return new Promise((resolve) => {
    node.addEventListener('transitionend', function listener() {
      node.removeEventListener('transitionend', listener);
      node.style.transition = oldTransition;
      node.style.maxHeight = oldMaxHeight;
      node.style.overflow = oldOverflow;
      resolve();
    });
  });
}

function closeValidationMessage(
  node: HTMLElement,
  duration = '2.25s',
  timing = 'linear'
): Promise<void> {
  const oldTransition = node.style.transition;
  const oldMaxHeight = node.style.maxHeight;
  const oldOverflow = node.style.overflow;

  node.style.transition = `max-height ${duration} ${timing}`;
  node.style.maxHeight = node.scrollHeight + 'px';
  node.style.overflow = 'hidden';

  setTimeout(() => {
    node.style.maxHeight = '0';
  });

  return new Promise((resolve) => {
    node.addEventListener('transitionend', function listener() {
      node.removeEventListener('transitionend', listener);
      node.style.transition = oldTransition;
      node.style.maxHeight = oldMaxHeight;
      node.style.overflow = oldOverflow;
      resolve();
    });
  });
}

const validationMessageStyles = /*css*/ `
  #__external-content__ {
    height: 0;
    max-height: 0;
    overflow: hidden;
    font-size: var(--sl-font-size-small);
    font-size: var(--sl-font-size-medium);
    margin-left: calc(var(--label-width) + var(--gap-width));
    box-sizing: border-box;
  }

  #__validation__ {
    display: flex;
    align-items: center;
  }
   
  #__validation-icon__,
  #__validation-message__ {
    font-size: var(--sl-font-size-small);
  }

  :host([data-user-invalid]) #__external-content__ {
    height: auto;
    max-height: none;
    color: var(--sl-color-danger-700);
    font-weight: var(--sl-font-weight-semibold);
    padding: 0.25em 0;
  }

  #__validation-icon__ {
    color: var(--sl-color-danger-600);
    margin-inline-end: 0.5em;
  }
`;

const exclamationIcon2 =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
    </svg>
  `);

const exclamationIcon3 =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>
  `);

const exclamationIcon =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  `);

const exclamationIcon5 =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
      <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
    </svg>
  `);
