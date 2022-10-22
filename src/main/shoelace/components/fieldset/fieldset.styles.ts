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
    padding: 1px 0.75em 3px 0.75em;

    background: linear-gradient(
      30deg,
      var(--sl-color-neutral-100),
      var(--sl-color-neutral-50) 70%
    );

    box-sizing: border-box;
    border-radius: 1px;
    font-size: 100%;
    color: var(--sl-color-neutral-800);
    border: 1px solid var(--sl-color-neutral-200);
    border-radius: 3px;
  }

  fieldset {
    padding: 0;
    margin: 0;
  }
`;
