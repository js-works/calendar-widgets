import { css } from 'lit';

export default css`
  .sl-control {
    margin: 4px 0;
  }

  .sl-control::part(form-control) {
    display: flex;
    flex-direction: var(--label-layout-direction, column);
    align-items: var(--label-layout-justify, stretch);
    gap: var(--label-layout-gap, 0);
  }

  .sl-control::part(form-control-label) {
    flex: 0 0 auto;
    width: var(--label-layout-width, auto);
    text-align: var(--label-layout-align, start);
    margin: 2px 0;
  }

  .sl-control::part(form-control-input) {
    flex: 1 1 auto;

    /*
    margin: var(--label-layout-vertical, 0 0 0.4rem 0)
      var(--label-layout-horizontal, 2px 0);
    */
  }

  .sl-control-label--required::after {
    font-family: var(--sl-font-mono);
    font-size: var(--sl-font-size-medium);
    position: relative;
    top: -2px;
    margin: 0 calc(-1.5ch) 0 0;
    left: calc(-0.5ch + 2px);
    width: 1ex;
    max-width: 1ex;
    overflow: hidden;
    content: '*';
    color: var(--sl-color-danger-700);
    box-sizing: border-box;
  }

  /* -------------------------------------------------------------- */

  .validation-error:not(:empty) {
    font-size: 90%;
    font-weight: var(--sl-font-weight-normal);
    color: var(--sl-color-danger-700);
    padding: 0 0.5rem 0.375rem 0;

    margin: 0 0 0 calc(var(--label-layout-width) + var(--label-layout-gap));
  }
`;
