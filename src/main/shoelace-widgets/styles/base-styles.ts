const allFields = /*css*/ `
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
      --label-width: 140px;
      --gap-width: 10px;
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
      grid-column: span 2;
      padding-left: calc(var(--label-width) + var(--gap-width));
      margin: 0;
    }

    /* TODO!!! */
    ${fieldSelector}:is(sl-select)::part(form-control-help-text) {
      padding-left: 0;
    }
  `;
