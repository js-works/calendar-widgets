import { css } from 'lit';

export default css`
  :host {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
  }

  .base {
    position: absolute;
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-normal);
    color: var(--sl-color-neutral-1000);
    background-color: var(--sl-color-neutral-0);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    padding: 0.75rem 1rem;
    border: 0 solid var(--sl-color-neutral-200);
    border-bottom-width: 1px;
    box-shadow: var(--sl-shadow-x-large);
  }

  .header-icon {
    color: var(--sl-color-orange-500);
    font-size: 150%;
  }

  .header-title {
    flex-grow: 1;
  }

  .content {
    padding: 2rem 1rem;
    overflow: auto;
    box-sizing: border-box;
    flex-grow: 1;
    min-height: 100%;
  }

  sl-tab-panel {
    padding: 0 1rem;
    box-sizing: border-box;
  }
`;
