import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../../misc/base-element';

// styles
import hboxStyles from './vbox.styles';

// === exports =======================================================

export { VBox };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-vbox': VBox;
  }
}

// === VBox ==========================================================

@customElement('sx-vbox')
class VBox extends BaseElement {
  static styles = hboxStyles;

  @property()
  alignItems: 'top' | 'center' | 'bottom' = 'center';

  @property()
  gap: 'none' | 'tiny' | 'small' | 'medium' | 'large' | 'huge' = 'none';

  render() {
    const gapClass = ['tiny', 'small', 'medium', 'large', 'huge'].includes(
      this.gap
    )
      ? `gap-${this.gap}`
      : 'gap-none';

    const alignClass =
      this.alignItems === 'top' || this.alignItems === 'bottom'
        ? `align-${this.alignItems}`
        : 'align-center';

    return html`
      <div class=${`base ${gapClass} ${alignClass}`}>
        <slot></slot>
      </div>
    `;
  }
}
