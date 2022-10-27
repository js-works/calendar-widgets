import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .input:not(.input--disabled),
  .input:not(.input--disabled)::part(input),
  .input:not(.input-disabled)::part(suffix) {
    cursor: pointer;
  }

  .dropdown {
  }

  .popup-content {
    display: flex;
    flex-direction: row;
    box-shadow: var(--sl-shadow-large);
    border-radius: 0 0 4px 4px;
    background-color: var(--sl-color-neutral-0);
  }

  .popup-column-1 {
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-primary-600);
    opacity: 90%;
    padding: 1rem 1.25rem;
    box-sizing: border-box;
  }

  .popup-column-2 {
    display: flex;
    flex-direction: column;
    width: 18rem;
  }

  .selection-info-1 {
    font-size: 115%;
  }

  .selection-info-2 {
    font-size: 115%;
    line-height: 1.25em;
  }

  .selection-info-3 {
    font-size: 160%;
  }

  .popup-footer {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 0.25rem 0.5rem 0.5rem 0.25rem;
  }

  .button::part(label) {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }

  sl-dropdown {
    display: block;
  }
`;
