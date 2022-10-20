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
    border-width: 0px;
    background-color: var(--sl-color-neutral-100);

    background: linear-gradient(
      90deg,
      var(--sl-color-neutral-100),
      var(--sl-color-neutral-50) 70%
    );

    box-sizing: border-box;
    border-radius: 1px;
    font-size: 100%;
    color: var(--sl-color-neutral-800);
  }

  fieldset {
    padding: 0;
    margin: 0;
  }
`;
