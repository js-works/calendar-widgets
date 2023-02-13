import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  .base {
    padding: 0;
    margin: 0 0 1rem 0;
    border: none;
  }

  .caption {
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 2px 0.75em 4px 0.75em;

    /*
    background: linear-gradient(
      90deg,
      var(--sl-color-neutral-100),
      var(--sl-color-neutral-50) 90%
    );
    */

    position: relative;
    background-color: var(--sl-color-neutral-100);
    border-radius: 1px;
    xxxborder-left: 1px solid var(--sl-color-neutral-600);
    border-bottom: 1px solid var(--sl-color-neutral-300);
    box-sizing: border-box;
    border-radius: 2px;
    color: var(--sl-color-neutral-1000);
    font-size: calc(100% - 1px);
    font-weight: var(--sl-font-weight-semibold);
  }

  .caption:before {
    position: absolute;
    display: block;
    content: '';
    border-left: 0px solid var(--sl-color-neutral-300);
    opacity: 0.5;
    height: 100%;
    width: 100%;
    border-radius: 3px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    left: 0;
    top: 0;
  }

  fieldset {
    padding: 0;
    margin: 0;
  }
`;
