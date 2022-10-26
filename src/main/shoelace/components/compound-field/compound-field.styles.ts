import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}


  .fields {
    display: grid;
    grid-auto-columns: minmax(0, auto);
    grid-auto-flow: column;
    grid-template-columns: minmax(0, 20%) minmax(0, 80%);
    box-sizing: border-box;
    grid-rows: auto;
    gap: 0.25em;
  }

  ::slotted(*) {
    box-sizing: border-box;
  }
`;
