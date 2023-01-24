import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelLayoutStyles from '../../styles/label-layout.styles';

export default css`
  ${componentStyles}
  ${labelLayoutStyles}

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
    border-left: 1px solid var(--sl-color-primary-600);
    box-sizing: border-box;
    border-radius: 1px;
    color: var(--sl-color-primary-950);
    font-size: calc(100% - 1px);
  }

  .caption:before {
    position: absolute;
    display: block;
    content: '';
    border: 1px solid var(--sl-color-primary-600);
    opacity: 0.5;
    border-width: 0 0 0 1px;
    height: 100%;
    width: 100%;
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
