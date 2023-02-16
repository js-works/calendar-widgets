/**
 * `activateValidation` is a utility function for Shoelace based HTML forms.
 * It allows to switch from the usual tooltip based way of showing validation
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
export function activateInlineValidation(
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
    const message = formControl.validationMessage;
    const root = formControl.shadowRoot;
    const lastChild = root.lastChild;
    const formControlPart = root.querySelector('[part=form-control]');
    let validationMessagePart: HTMLElement;

    if (
      lastChild instanceof HTMLElement &&
      lastChild.getAttribute('part') === 'form-control-validation-message'
    ) {
      validationMessagePart = lastChild;
    } else {
      validationMessagePart = document.createElement('div');

      validationMessagePart.setAttribute(
        'id',
        'form-control-validation-message'
      );

      validationMessagePart.setAttribute(
        'part',
        'form-control-validation-message'
      );

      root.append(validationMessagePart);
    }

    validationMessagePart.innerText = message;

    if (message === '') {
      formControlPart.removeAttribute('aria-errormessage');
    } else {
      formControlPart.setAttribute(
        'aria-errormessage',
        'form-control-validation-message'
      );
    }
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
      const lastChild = formControl.shadowRoot!.lastChild;

      if (
        lastChild instanceof HTMLElement &&
        lastChild.getAttribute('part') === 'form-control-validation-message'
      ) {
        formControl
          .shadowRoot!.querySelector('[part=form-control]')
          ?.removeAttribute('aria-errormessage');

        lastChild.remove();
      }
    }

    formControls = null;
    cancelled = true;
  };

  return cancel;
}
