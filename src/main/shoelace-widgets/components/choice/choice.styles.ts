import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .base {
  }

  .base.radios .form-control-input {
    display: flex;
    flex-direction: row;
  }

  .base.horizontal-radios .form-control-input {
    height: 2em;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
`;
