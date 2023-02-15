import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

// styles
import fieldsetStyles from './fieldset.styles';

// === exports =======================================================

export { Fieldset };

// === exported types ==========================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-fieldset': Fieldset;
  }
}

// === Fieldset ======================================================

@customElement('sx-fieldset')
class Fieldset extends LitElement {
  static styles = fieldsetStyles;

  @property()
  caption = '';

  @property({ attribute: 'label-layout', reflect: true })
  labelLayout: 'vertical' | 'horizontal' | 'auto' = 'auto';

  @property({ attribute: 'validation-mode', reflect: true })
  validationMode: 'default' | 'inline' | null = null;

  firstUpdated() {
    // TODO!!!!!!!!!!!!!!!!!!!
    setTimeout(() => {
      console.log('first-updated');
      activateInlineFormValidation(this);
    }, 0);
  }

  render() {
    return html`
      <fieldset
        class=${classMap({
          'base': true,
          'label-layout-vertical': this.labelLayout === 'vertical',
          'label-layout-horizontal': this.labelLayout === 'horizontal'
        })}
      >
        ${when(
          this.caption,
          () => html`<legend class="caption">${this.caption}</legend>`
        )}
        <slot></slot>
      </fieldset>
    `;
  }
}

/**
 * `activateInlineFormValidation` is a utility function for Shoelace based HTML
 * forms. It allows to switch from the usual tooltip based way of showing validation
 * errors to inline form validation where validation errors will be displayed below
 * the corresponding form controls.
 * This will be achieved by dynamically adding data attributes for error messages
 * to the form controls, if required. And to use the CSS function `attr(...)`
 * to retrieve the error messages in CSS (by using the `::after` pseudo-element).
 *
 * @param container  A DOM container element, for example the form element
 * @param errorAttribute  Name of the data attribute of the form controls to
 *                        store the current validation message. Default value is
 *                        'data-error'.
 *
 * @return  Returns a cancellation function to undo the changes that
 *          have been necessary to activate inline validation
 */
function activateInlineFormValidation(
  container: HTMLElement,
  errorAttribute = 'data-error'
) {
  let formControls: Set<HTMLElement> | null = null;

  // Checks whether an element is a Shoelace form control
  const isFormControl = (elem: Element) => {
    return (
      elem instanceof HTMLElement &&
      'checkValidity' in elem &&
      'reportValidity' in elem &&
      'validationMessage' in elem &&
      typeof elem.checkValidity === 'function' &&
      typeof elem.reportValidity === 'function' &&
      typeof elem.validationMessage === 'string'
    );
  };

  // Updates the error data attribute of a given Shoelace form control,
  // depending on the form control's `validationMessage` property
  const updateValidationMessage = (formControl: any) => {
    // TODO!!!
    const message = formControl.validationMessage;

    /*
    const formControlPart: HTMLElement = formControl.shadowRoot.querySelector(
      '[part=form-control]'
    );

    if (!formControlPart) {
      return;
    }
    */

    const root = formControl.shadowRoot;

    let validationMessagePart: HTMLElement;

    if (
      root.lastElementChild!.getAttribute('part') ===
      'form-control-validation-message'
    ) {
      validationMessagePart = root.lastElementChild! as HTMLElement;
    } else {
      validationMessagePart = document.createElement('div');

      validationMessagePart.setAttribute(
        'part',
        'form-control-validation-message'
      );

      validationMessagePart.setAttribute('hidden', '');
      root.append(validationMessagePart);
    }

    validationMessagePart.innerText = message;
  };

  // Updates the error attributes for all Shoelace form controls
  // in the container and returns a set of all currently existing
  // Shoelace form controls in the container.
  const updateAllValidationMessages = (): Set<HTMLElement> => {
    const ret = new Set<HTMLElement>();

    for (const elem of container.querySelectorAll<HTMLElement>(
      ':is([data-valid], [data-invalid])'
    )) {
      if (isFormControl(elem)) {
        ret.add(elem);
        updateValidationMessage(elem);
      }
    }

    return ret;
  };

  // --- event handlers --------------

  const onInvalid = (event: Event) => {
    // Prevent the browser from showing the usual validation error tooltips
    event.preventDefault();
  };

  const onInput = (event: Event) => {
    const target = event.target as HTMLElement;

    if (formControls!.has(target)) {
      // Update error attribute depending on validation message
      updateValidationMessage(target);
    }
  };

  // --- main ------------------------

  // Register event handlers
  container.addEventListener('sl-input', onInput);
  container.addEventListener('sl-invalid', onInvalid, true);

  // Register mutation observer to detect dynamically added
  // or removed form controls
  const observer = new MutationObserver(() => {
    // Update and remember current form controls
    const newFormControls = updateAllValidationMessages();

    // Cleanup previously removed form controls
    for (const formControl of formControls!) {
      if (!newFormControls.has(formControl)) {
        formControl.removeAttribute(errorAttribute);
      }
    }

    formControls = newFormControls;
  });

  // Observe the whole DOM subtree of the container
  observer.observe(container, {
    childList: true,
    subtree: true
  });

  formControls = updateAllValidationMessages();

  // provide cancellation functionality

  let cancelled = false;

  const cancel = () => {
    if (cancelled) {
      return;
    }

    container.removeEventListener('sl-input', onInput);
    container.removeEventListener('sl-invalid', onInvalid, true);
    observer.disconnect();

    for (const formControl of formControls!) {
      /* TODO!!!!
      formControl.shadowRoot
        ?.querySelector('[part=form-control-validation-message]')
        ?.remove();
      */
    }

    formControls = null;
    cancelled = true;
  };

  return cancel;
}
