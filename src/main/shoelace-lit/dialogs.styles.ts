import { css } from 'lit';
import labelLayoutStyles from '../shoelace/styles/label-layout.styles';

export default css`
  ${labelLayoutStyles}

  .base {
    position: absolute;
    width: 0;
    max-width: 0;
    height: 0;
    max-height: 0;
    left: -10000px;
    top: -10000px;
    overflow: hidden;
  }

  .dialog {
    min-width: var(--width, 31rem);
    max-width: var(--width, auto);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    color: var(--sl-color-neutral-1000);
    padding: 0;
    --header-spacing: 0;
    --body-spacing: 0;
    --footer-spacing: 0;
  }

  .dialog::part(panel) {
    min-width: 30rem;
  }

  .dialog::part(title) {
    user-select: none;
  }

  .dialog::part(title),
  .dialog::part(body) {
    padding: 0;
  }

  .dialog::part(body) {
    display: flex;
    flex-direction: column;
    user-select: none;
    padding-bottom: 0.5rem;
    box-sizing: border-box;
    padding: 0 2rem 0.5rem 2rem;
  }

  .dialog::part(footer) {
    user-select: none;
  }

  .buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 0.625rem 1rem;
    background-color: var(--sl-color-neutral-100);
  }

  .icon {
    font-size: var(--sl-font-size-x-large);
  }

  .icon.info,
  .icon.question,
  .icon.confirmation,
  .icon.prompt,
  .icon.input {
    color: var(--sl-color-primary-500);
  }

  .icon.success {
    color: var(--sl-color-success-500);
  }

  .icon.warning {
    color: var(--sl-color-warning-500);
  }

  .icon.error,
  .icon.approval {
    color: var(--sl-color-danger-500);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: calc(1.2 * var(--sl-font-size-medium));
    padding: 0.75rem 1.25rem;
  }

  .message {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    padding: 0.5rem 0;
  }

  .message:empty {
    display: none;
  }

  .content {
    flex-grow: 1;
    padding: 0.5rem 2px 0 0;
  }

  .error-box--closed {
    xxxvisibility: hidden;
    max-height: 0;
    overflow: hidden;
  }

  .error-box-content {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-danger-700);
    box-sizing: border-box;
  }

  .error-box-error-icon {
    padding: 0 0.75rem;
  }

  .error-box-close-icon {
    font-size: var(--sl-font-size-large);
    padding: 0 0.75rem;
    cursor: pointer;
  }

  .error-box-text {
    padding: 0.375rem 2rem 0.375rem 0;
    text-align: start;
    flex-grow: 1;
    justify-self: stretch;
  }
`;
