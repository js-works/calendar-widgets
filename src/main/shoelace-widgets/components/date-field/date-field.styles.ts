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
    flex-direction: column;
    box-shadow: var(--sl-shadow-large);
    border-radius: 0 0 4px 4px;
    background-color: var(--sl-color-neutral-0);
    border: 1px solid var(--sl-color-primary-100);
    width: 23em;
  }

  .popup-header {
    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: center;
    gap: 0.75rem;
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-primary-600);
    padding: 0 0 0 0.75rem;
    box-sizing: border-box;
  }

  .popup-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popup-close-button {
    font-size: 150%;
  }

  .popup-close-button::part(base) {
    color: var(--sl-color-neutral-0);
    padding: 0.25rem;
    border-radius: 0;
  }

  .popup-close-button:hover::part(base) {
    background-color: var(--sl-color-primary-700);
  }

  .popup-close-button:active::part(base) {
    background-color: var(--sl-color-primary-800);
  }

  .selection-info-1 {
    font-size: 115%;
  }

  .selection-info-2 {
    font-size: 115%;
    line-height: 1.25em;
  }

  .selection-info-3 {
    font-size: 140%;
  }

  .popup-footer {
    display: flex;
    flex-grow: 1;
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
