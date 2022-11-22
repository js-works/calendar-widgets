import { css } from 'lit';
import labelLayoutStyles from '../shoelace/styles/label-layout.styles';

export default css`
  ${labelLayoutStyles}

  .xxxbase {
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
    padding: 0.5rem 2rem 0.5rem 2rem;
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
    font-size: 140%;
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

  /* experimental */

  .dialog.data-form::part(body) {
    padding: 0;
  }

  .dialog.data-form .main {
    padding: 1rem 1.75rem;
  }

  .dialog.data-form .icon,
  .dialog.data-form.icon::part(base) {
    color: white !important;
  }

  .dialog.data-form::part(close-button) {
    color: red !important; /* TODO!!! */
  }

  .dialog.data-form .icon {
    font-size: 110%;
  }

  .dialog.data-form::part(close-button) {
    background-color: var(--sl-color-primary-700);
    padding: 0;
    color: white !important;
  }

  .dialog.data-form::part(close-button_base) {
    color: white !important;
  }

  .dialog.data-form .header {
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-primary-700);
    padding: 0.5rem 0.75rem;
  }
`;
