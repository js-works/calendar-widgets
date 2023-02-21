import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { BaseElement } from '../../misc/base-element';

// === exports =======================================================

export { FormSection };

// === exported types ==========================================

@customElement('sx-form-section')
class FormSection extends BaseElement {
  @property()
  caption = '';

  render() {
    return html`
      <fieldset class="base label-layout-vertical">
        <div class="columns">
          <div class="caption">${this.caption}</div>
          <div class="content">
            <slot class="fields"></slot>
          </div>
        </div>
      </fieldset>
    `;
  }
}
