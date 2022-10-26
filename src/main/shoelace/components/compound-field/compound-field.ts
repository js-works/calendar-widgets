import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { createRef, ref } from 'lit/directives/ref';
import { LocalizeController } from '../../i18n/i18n';

// styles
import compoundFieldStyles from './compound-field.styles';

// === exports =======================================================

export { CompoundField };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-compound-field': CompoundField;
  }
}

// === Choice ========================================================

@customElement('sx-compound-field')
class CompoundField extends LitElement {
  static styles = compoundFieldStyles;

  static {
    // dependencies (to prevent too much tree shaking)
    void [];
  }

  @property()
  label = '';

  render() {
    return html`
      <div class="base form-control">
        <label class="form-control-label">${this.label}</label>
        <div class="form-control-input">
          <slot class="default-slot fields"></slot>
        </div>
      </div>
    `;
  }
}
