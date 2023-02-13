import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

// styles
import fieldsetStyles from './fieldset.styles';

// === exports =======================================================

export { Fieldset };

// === exported types ==========================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-fieldset': Fieldset;
  }
}

// === Fieldset ======================================================

@customElement('sx-fieldset')
class Fieldset extends LitElement {
  static styles = fieldsetStyles;

  @property()
  caption = '';

  @property({ attribute: 'label-layout', reflect: true })
  labelLayout: 'vertical' | 'horizontal' | 'auto' = 'auto';

  @property({ attribute: 'validation-mode', reflect: true })
  validationMode: 'default' | 'inline' | null = null;

  firstUpdated() {
    this.closest('form')?.addEventListener(
      'invalid',
      (ev) => {
        alert('juhu');
        console.log(1, 'invalid', ev.target);
        if (this.validationMode === 'inline') {
          //  ev.preventDefault();
        }
      },
      true
    );
  }

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
