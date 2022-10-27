import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  :host {
    display: inline-block;
    min-width: 0;
    width: 100%;
  }

  sl-input::part(input) {
    width: 100%;
  }
`;
