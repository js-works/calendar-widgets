import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}


  .fields {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, auto);
    box-sizing: border-box;
    grid-rows: auto;
    gap: 0.325em;
  }

  ::slotted(*) {
    box-sizing: border-box;
  }
`;
