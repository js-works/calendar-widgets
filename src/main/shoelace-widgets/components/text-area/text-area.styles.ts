import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  sl-textarea::part(form-control) {
    margin: 0;
    padding: 0;
  }
`;
