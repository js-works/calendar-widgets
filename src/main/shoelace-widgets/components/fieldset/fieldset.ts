import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { when } from 'lit/directives/when';

// styles
import fieldsetStyles from './fieldset.styles';

// === exports =======================================================

export { Fieldset };

// === exported types ==========================================

@customElement('sx-fieldset')
class Fieldset extends LitElement {
  static styles = fieldsetStyles;

  @property()
  caption = '';

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
        ${when(
          this.caption,
          () => html`<legend class="caption">${this.caption}</legend>`
        )}
        <slot></slot>
      </fieldset>
    `;
  }
}
