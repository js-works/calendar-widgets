import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { property } from 'lit/decorators';
import { createEmitter, Listener } from '../../misc/events';

import sidenavStyles from './sidenav.styles';

// === exports =======================================================

export { Sidenav };

// === Sidenav ==========================================================

@customElement('sx-sidenav')
class Sidenav extends LitElement {
  static styles = sidenavStyles;

  render() {
    return html`
      <div class="base">
        <div class="nav">
          <ul>
            <li class="item active">General</li>
            <li class="item">Contact</li>
            <li class="item">Notes</li>
          </ul>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
