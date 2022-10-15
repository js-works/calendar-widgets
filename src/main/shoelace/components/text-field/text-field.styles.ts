import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .base.invalid sl-input::part(input) {
    background-color: var(--sl-color-danger-50);
  }

  .base.invalid sl-input::part(base) {
    border-color: var(--sl-color-danger-700);
    --sl-input-focus-ring-color: var(--sl-color-danger-400);
  }
`;
