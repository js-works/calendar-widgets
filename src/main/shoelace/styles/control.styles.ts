import { css } from 'lit';

//document.body.style.setProperty('--on', 'inherit');
//document.body.style.setProperty('--off', ' ');
//document.body.style.setProperty('--label-layout-vertical', 'inherit');
//document.body.style.setProperty('--label-layout-horizontal', ' ');

const labelLayoutHorizontalWidth = css`9rem`;
const labelLayoutVerticalGap = css`1rem`;

export default css`
  :host {
    --on: inherit;
    --off: ;
  }

  .base {
    --label-layout-vertical: var(--on);
    --label-layout-horizontal: var(--off);
  }

  .sl-control {
    --xxxlabel-layout-vertical: var(--labels-vertical);
    --xxxlabel-layout-horizontal: var(--labels-horizontal);
  }

  .sl-control::part(form-control) {
    display: flex;

    flex-direction: var(--label-layout-vertical, column)
      var(--label-layout-horizontal, row);

    align-items: var(--label-layout-vertical, stretch)
      var(--label-layout-horizontal, center);

    gap: var(
        --label-layout-horizontal,
        var(--label-layout-horizontal-gap, ${labelLayoutVerticalGap})
      )
      var(--label-layout-vertical, 0);
  }

  .sl-control::part(form-control-label) {
    flex: 0 0 auto;

    width: var(--label-layout-vertical, auto)
      var(
        --label-layout-horizontal,
        var(--label-layout-horizontal-width, ${labelLayoutHorizontalWidth})
      );

    text-align: var(--label-layout-vertical, left)
      var(--label-layout-horizontal, right);

    margin: var(--label-layout-vertical, 2px 0 1px 0)
      var(--label-layout-horizontal, 2px 0);
  }

  .sl-control::part(form-control-input) {
    flex: 1 1 auto;

    margin: var(--label-layout-vertical, 0 0 0.4rem 0)
      var(--label-layout-horizontal, 2px 0);
  }

  .sl-control-label {
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

    margin: 0 0 0 var(--label-layout-vertical, 0)
      var(
        --label-layout-horizontal,
        calc(
          ${labelLayoutHorizontalWidth} +
            var(--label-layout-horizontal-gap, ${labelLayoutVerticalGap})
        )
      );
  }
`;
