import { css, unsafeCSS, LitElement } from 'lit';
import baseStyles from '../../main/shoelace-elements/styles/base-styles';

export class Component extends LitElement {
  static styles = css`
    ${unsafeCSS(baseStyles)}
  `;
}
