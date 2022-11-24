import { css } from 'lit';
import labelLayoutStyles from '../../../shoelace-widgets/styles/label-layout.styles';

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

  .dialog .icon {
    color: var(--dialog--light, var(--sl-color-neutral-0))
      var(--dialog--dark, var(--sl-color-neutral-1000));
  }

  .header {
    font-size: calc(var(--sl-font-size-medium) + 1px);
  }

  .dialog::part(body) {
    padding: 0;
  }

  .dialog .main {
    padding: 1rem 1.75rem;
  }

  .dialog .icon {
    font-size: calc(100% + 2px);
  }

  .dialog::part(close-button__base) {
    height: 2.125rem;
    box-sizing: border-box;
    border-radius: 0;
  }

  .dialog:not(.dialog--input) .header {
    padding: 0.3rem 0.75rem;
    height: 2.125rem;
    box-sizing: border-box;
  }

  .dialog:not(.dialog--input) .header,
  .dialog:not(.dialog--input)::part(close-button__base) {
    color: var(--sl-color-neutral-1000);
    background-color: var(--sl-color-neutral-0);
  }

  .dialog:not(.dialog--input) .header,
  .dialog:not(.dialog--input)::part(close-button__base) {
    background-color: transparent !important;
  }

  .dialog:not(.dialog--input)::part(close-button__base) {
    font-size: 125%;
    margin-top: 0.4em;
    margin-right: 0.25rem;
  }

  dialog::not(dialog--input).main {
    padding: 0.5em 3em 1em 4.6em !important;
  }

  .message {
    font-size: calc(100%);
  }

  .dialog:not(.dialog--input) .title {
    font-size: 115%;
    padding-top: 1.5em;
    padding-left: 0.25em;
  }

  .dialog:not(.dialog--input) .icon {
    border-radius: 50%;
    box-sizing: border-box;
    padding: 0.5em;
    font-size: 125%;
    margin-left: 0.25em;
    margin-top: 1.5em;
  }

  .dialog--info .icon,
  .dialog--confirmation .icon,
  .dialog--prompt .icon {
    color: var(--sl-color-primary-600);

    background-color: var(--dialog--light, var(--sl-color-primary-100))
      var(--dialog--dark, var(--sl-color-neutral-100));
  }

  .dialog--success .icon {
    color: var(--sl-color-success-600);

    background-color: var(--dialog--light, var(--sl-color-success-100))
      var(--dialog--dark, var(--sl-color-neutral-100));
  }

  .dialog--warning .icon,
  .dialog--error .icon,
  .dialog--approval .icon {
    color: var(--sl-color-danger-600);

    background-color: var(--dialog--light, var(--sl-color-danger-100))
      var(--dialog--dark, var(--sl-color-neutral-100));
  }

  .dialog--input .header {
    padding: 0 1rem;
    margin: 0;
    height: 2.25rem;
  }

  .dialog--input::part(close-button__base) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: var(--sl-font-size-medium);
  }

  .dialog--input .header,
  .dialog--input::part(close-button__base) {
    color: var(--dialog--light, var(--sl-color-neutral-0))
      var(--dialog--dark, var(--sl-color-neutral-1000));

    background-color: var(--dialog--light, var(--sl-color-primary-600))
      var(--dialog--dark, var(--sl-color-neutral-100));
  }

  .dialog--input::part(close-button__base) {
    font-size: 150%;
  }

  .dialog--input::part(close-button__base):hover {
    background-color: var(--dialog--light, var(--sl-color-primary-700))
      var(--dialog--dark, var(--sl-color-neutral-200));
  }

  .dialog--input::part(close-button__base):active {
    background-color: var(--dialog--light, var(--sl-color-primary-800))
      var(--dialog--dark, var(--sl-color-neutral-300));
  }

  .dialog--input .main {
    padding: 1rem;
  }
`;
