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

    background-color: var(--sl-color-neutral-50);
    border-bottom: 1px solid var(--sl-color-neutral-200);
    border-radius: 1px;
    box-sizing: border-box;
    border-radius: 1px;
    color: var(--sl-color-neutral-900);
    font-size: calc(100% - 1px);
  }

  fieldset {
    padding: 0;
    margin: 0;
  }
`;
