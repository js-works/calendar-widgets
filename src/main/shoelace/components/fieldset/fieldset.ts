import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';

// styles
import fieldsetStyles from './fieldset.styles';

// === exports =======================================================

export { Fieldset };

// === exported types ==========================================

@customElement('sx-fieldset')
class Fieldset extends LitElement {
  static styles = fieldsetStyles;

  @property({ attribute: 'label-layout' })
  labelLayout: 'vertical' | 'horizontal' | 'auto' = 'auto';

  render() {
    return html`
      <fieldset
        class=${classMap({
          'base': true,
          'label-layout-vertical': this.labelLayout === 'vertical',
          'label-layout-horizontal': this.labelLayout === 'horizontal'
        })}
      >
        <slot></slot>
      </fieldset>
    `;
  }
}
