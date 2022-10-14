import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelLayoutStyles from '../../styles/label-layout.styles';

export default css`
  ${componentStyles}
  ${labelLayoutStyles}

  :host {
    display: block;
  }

  .base {
    padding: 0;
    margin: 0;
    border: none;
  }
`;
