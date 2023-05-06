const allFields = `
  :is(sl-input, sl-select, sl-radio-group, sx-text-field, sx-date-field,
    sx-compound-field)
`;

const fieldSelector = /*css*/ `:is(
  :is(sx-fieldset[label-layout='horizontal']
      > ${allFields}),
    
    :is(sx-fieldset[label-layout='horizontal']
    > :is(sx-fieldset[label-layout='auto'])
      > ${allFields}),
  )`;

export default /*css*/ `
  sl-radio-group[data-horizontal] sl-radio {
    display: inline-block;
  }


    /* sx-fieldset */

    sx-fieldset {
      --label-width: auto;
      --gap-width: 0;
    }
    
    ${fieldSelector} {
      --label-width: 10rem;
      --gap-width: 1rem;
    }

    ${fieldSelector} + ${fieldSelector} {
      margin-top: var(--sl-spacing-x-small);
    }

    ${fieldSelector}::part(form-control) {
      display: grid;
      grid: auto / var(--label-width) 1fr;
      gap: var(--sl-spacing-3x-small) var(--gap-width);
      align-items: center;
    }

    ${fieldSelector}::part(form-control-label) {
      text-align: right;
    }

    ${fieldSelector}::part(form-control-help-text) {
      grid-column-start: 2;
      margin: 0;
    }

    ${fieldSelector}::part(form-control-validation-message) {
      margin-left: calc(var(--label-width) + var(--gap-width));
    }
    
    ${fieldSelector}::part(__validation-tooltip__) {
      margin-left: calc(var(--label-width) + var(--gap-width));
    }

    /* inline validation styles */
  /*  
  sx-fieldset[validation-mode=inline] :is([data-valid], [data-invalid]):not(sl-button) {
    display: block;
    margin-bottom: var(--sl-spacing-small);
  }

  sx-fieldset[validation-mode=inline] sl-radio-group sl-radio {
    display: inline-block;
    margin-right: 1rem;
  }
  
  sx-fieldset[validation-mode=inline] sl-input[data-user-invalid]::part(base),
  sx-fieldset[validation-mode=inline] sl-textarea[data-user-invalid]::part(base),
  sx-fieldset[validation-mode=inline] sl-select[data-user-invalid]::part(combobox) {
    border-color: var(--sl-color-danger-600);
  }

  sx-fieldset[validation-mode=inline] sl-input:focus-within[data-user-invalid]::part(base),
  sx-fieldset[validation-mode=inline] sl-textarea:focus-within[data-user-invalid]::part(base),
  sx-fieldset[validation-mode=inline] sl-select:focus-within[data-user-invalid]::part(combobox) {
    border-color: var(--sl-color-danger-600);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
  }

  sx-fieldset[validation-mode=inline] sl-input[data-user-valid]::part(base),
  sx-fieldset[validation-mode=inline] sl-textarea[data-user-valid]::part(base),
  sx-fieldset[validation-mode=inline] sl-select[data-user-valid]::part(combobox) {
    border-color: var(--sl-color-success-600);
  }

  sx-fieldset[validation-mode=inline] sl-input:focus-within[data-user-valid]::part(base),
  sx-fieldset[validation-mode=inline] sl-textarea:focus-within[data-user-valid]::part(base),
  sx-fieldset[validation-mode=inline] sl-select:focus-within[data-user-valid]::part(combobox) {
    border-color: var(--sl-color-success-600);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-success-300);
  }
  */

  /* inline validation styles */

  /*
  sx-fieldset[validation-mode=inline] :is(:not([data-user-invalid]), [data-user-invalid])::part(form-control-validation-message) {
    display: block;
    overflow: hidden;
    color: var(--sl-color-danger-700);
    line-height: calc(var(--sl-font-size-medium) + 0.25em);
    font-size: var(--sl-font-size-medium);
    box-sizing: border-box;
  }

  sx-fieldset[validation-mode=inline] [data-user-invalid]::part(form-control-validation-message) {
    padding-top: 2px;
    max-height: 5rem;
    transition: max-height 0.5s linear;
  }
  
  sx-fieldset[validation-mode=inline] :not([data-user-invalid])::part(form-control-validation-message) {
    max-height: 0;
    transition: max-height 0.4s ease-out;
  }

  sx-fieldset[validation-mode=inline] sx-text-field[data-user-valid]::part(form-control-input) {
    border: 1px solid var(--sl-color-success-600);
  }
  
  sx-fieldset[validation-mode=inline] sx-text-field[data-user-invalid]::part(form-control-input) {
    border: 1px solid var(--sl-color-danger-600);
  }
  
  sx-fieldset[validation-mode=inline] sx-text-field:focus-within[data-user-valid]::part(base) {
    border-color: var(--sl-color-success-600);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-success-300);
  }

  sx-fieldset[validation-mode=inline] sx-text-field:focus-within[data-user-invalid]::part(base) {
    border-color: var(--sl-color-danger-600);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
  }
`;
