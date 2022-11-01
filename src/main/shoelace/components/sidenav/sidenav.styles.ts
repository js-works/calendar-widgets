import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  .base {
    display: flex;
    gap: 0.75rem;
  }

  .base > :first-child {
    padding-right: 0.5rem;
    border-right: 1px solid var(--sl-color-neutral-200);
  }

  .base > :nth-child(2) {
    flex-grow: 1;
  }

  .title {
    color: var(--sl-color-neutral-900);
    font-size: calc(100% - 1px);
  }

  ul {
    min-width: 10em;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .item {
    padding: 0.5rem 1rem;
    margin: 0.125rem;
    cursor: pointer;
  }

  .item.active {
    color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-100);
    border-radius: 6px;
    font-weight: 600;
  }

  .base {
    position: relative;
  }

  .panels {
    display: inline-grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  ::slotted(*) {
    grid-area: 1 / 1 / 1 / 1;
    visibility: hidden;
  }
`;
