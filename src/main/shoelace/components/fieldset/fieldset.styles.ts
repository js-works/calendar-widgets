import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelLayoutStyles from '../../styles/label-layout.styles';

export default css`
  ${componentStyles}
  ${labelLayoutStyles}

  .base {
    padding: 0;
    margin: 0;
    border: none;
  }

  .caption {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--sl-color-neutral-300);
    box-sizing: border-box;
    font-size: 100%;
    font-weight: 400;
    color: #888;
  }
`;
