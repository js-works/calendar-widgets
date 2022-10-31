import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { createEmitter, Listener } from '../../misc/events';

import sidenavStyles from './sidenav.styles';

// === exports =======================================================

export { Sidenav };

// === exported types ================================================

namespace Sidenav {
  export type Menu = {
    action?: string;
    text: string;
  }[];
}

// === Sidenav =======================================================

@customElement('sx-sidenav')
class Sidenav extends LitElement {
  static styles = sidenavStyles;

  @property()
  menu: Sidenav.Menu = [];

  render() {
    return html`
      <div class="base">
        <div class="nav">
          <ul>
            ${repeat(
              this.menu,
              (params, idx) => html`
                <li
                  class=${classMap({
                    item: true,
                    active: idx === 0
                  })}
                >
                  ${params.text}
                </li>
              `
            )}
          </ul>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
