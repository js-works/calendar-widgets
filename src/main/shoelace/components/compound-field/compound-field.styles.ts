import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}


  .fields {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 0.5rem;
    border: 1px solid blue;
  }

  ::slotted(*) {
    border: 1px solid green;
    justify-content: stretch;
  }

  .default-slot::slotted(*) {
    width: 10%;
  }
`;
