import { html } from 'lit';
import { getPluginOption, Plugin } from '../misc/plugins';

// === export ========================================================

export { inlineValidation };

// === types =========================================================

const formControlMatcher = 'form *';

const formControlTags = [
  'sl-color-picker',
  'sl-input',
  'sl-select',
  'sl-radio-group',
  'sl-range',
  'sl-switch',
  'sl-textarea'
];

const exclamationIcon =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  `);

const externalContent = html`
  <div
    id="__external-content__"
    aria-invalid="true"
    aria-errormessage="__validation-message__"
  >
    <style>
      #__external-content__ {
        max-height: 0;
        overflow: hidden;
        font-size: var(--sl-font-size-small);
        font-size: var(--sl-font-size-medium);
        margin-left: calc(var(--label-width, 0) + var(--gap-width, 0));
        box-sizing: border-box;
      }

      #__validation__ {
        display: flex;
        align-items: center;
        margin: 0.25em 0;
        color: var(--sl-color-danger-700);
        font-size: var(--sl-font-size-small);
        font-weight: var(--sl-font-weight-semibold);
        gap: 0.4em;
      }

      :host([data-user-invalid]) #__external-content__ {
        max-height: none;
      }
    </style>
    <div id="__validation__">
      <sl-icon id="__validation-icon__" src=${exclamationIcon}></sl-icon>
      <div id="__validation-message__"></div>
    </div>
  </div>
`;

patchCustomElementRegistry();

function patchCustomElementRegistry() {
  const oldDefineFn = customElements.define;

  const alreadyPatchedClasses = new Set<CustomElementConstructor>();

  formControlTags.forEach((tag) => {
    const componentClass = customElements.get(tag);

    if (componentClass && !alreadyPatchedClasses.has(componentClass)) {
      alreadyPatchedClasses.add(componentClass);
      patchCoreFormControl(componentClass);
    }
  });

  customElements.define = (name, constructor, options) => {
    if (
      !alreadyPatchedClasses.has(constructor) &&
      formControlTags.includes(name)
    ) {
      alreadyPatchedClasses.add(constructor);

      patchCoreFormControl(constructor);
    }

    oldDefineFn.call(customElements, name, constructor, options);
  };
}

function patchCoreFormControl(formControlClass: Function) {
  const render = formControlClass.prototype.render;

  formControlClass.prototype.render = function () {
    if (!this.hasUpdated) {
      getPluginOption('onComponentInit')?.(this);
    }

    const content = render.call(this);
    const mapper = getPluginOption('componentContentMapper');

    return mapper ? mapper(content, this) : content;
  };
}

function inlineValidation(type: 'static' | 'animated'): Plugin {
  return {
    id: 'inlineValidation',

    optionsMapper: (options) => ({
      onComponentInit: (elem) => {
        options.onComponentInit?.(elem);

        if (!('validity' in elem) || !('validationMessage' in elem)) {
          return;
        }

        const form = elem.closest('form'); // TODO!!!!!!

        if (form instanceof HTMLFormElement) {
          // TODO!!!!!!!!!!!!!!!!!
          form.addEventListener('reset', () => {
            setTimeout(() => updateValidationMessage(elem, type));
          });

          const handler = (ev: Event) => {
            if (ev.target !== elem) {
              return;
            }

            setTimeout(() => {
              if (
                elem.hasAttribute('data-user-valid') ||
                elem.hasAttribute('data-user-invalid')
              ) {
                updateValidationMessage(elem, type);
              }
            });
          };

          form.addEventListener('sl-input', handler);
          form.addEventListener('sl-blur', handler);

          form.addEventListener(
            'sl-invalid',
            (ev) => {
              if (elem.matches(formControlMatcher)) {
                updateValidationMessage(elem, type);
                ev.preventDefault();
              }
            },
            true
          );
        }
      },

      componentContentMapper: (content, elem) => {
        return !('validity' in elem) ||
          !('validationMessage' in elem) ||
          !elem.matches(formControlMatcher)
          ? content
          : [content, externalContent];
      }
    })
  };
}

// Updates the error data attribute of a given Shoelace form control,
// depending on the form control's `validationMessage` property
const updateValidationMessage = (
  formControl: any,
  type: 'static' | 'animated'
) => {
  const message = formControl.validationMessage;
  const root = formControl.shadowRoot;
  const lastChild = root.lastElementChild;
  const baseElem = root.querySelector('[part=form-control], .base');
  let externalContentElem: HTMLElement;
  let validationElem: HTMLElement;
  let validationMessageElem: HTMLElement;

  externalContentElem = lastChild;
  validationElem = externalContentElem.lastElementChild as HTMLElement;
  validationMessageElem = validationElem.lastElementChild as HTMLElement;

  if (validationMessageElem.innerText !== message) {
    if (type !== 'animated') {
      validationMessageElem.innerText = message;

      externalContentElem.style.maxHeight = message === '' ? '0' : 'none';
    } else {
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
  duration = '0.25s',
  timing = 'linear'
): Promise<void> {
  const oldTransition = node.style.transition;
  const oldMaxHeight = node.style.maxHeight;
  const oldOverflow = node.style.overflow;

  node.style.transition = `max-height ${duration} ${timing}`;
  node.style.maxHeight = node.scrollHeight + 'px';
  node.style.overflow = 'hidden';

  requestAnimationFrame(() => {
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

const exclamationIcon6 =
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
