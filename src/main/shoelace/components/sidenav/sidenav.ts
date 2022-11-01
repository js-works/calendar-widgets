import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { property, state } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { createEmitter, Listener } from '../../misc/events';

import sidenavStyles from './sidenav.styles';

// === exports =======================================================

export { Sidenav };

// === exported types ================================================

namespace Sidenav {
  export type Menu = {
    action?: string;
    text: string;
    panel?: string;
  }[];
}

// === Sidenav =======================================================

@customElement('sx-sidenav')
class Sidenav extends LitElement {
  static styles = sidenavStyles;

  @state()
  private _activePanel = 'general';

  @property()
  menu: Sidenav.Menu = [];

  private _setActiveTab(name: string) {
    this._activePanel = name;
    alert(name);
  }

  render() {
    return html`
      ${when(
        this._activePanel,
        () => html`
          <style>
            ::slotted([data-panel-name='${this._activePanel}']) {
              visibility: visible;
            }
          </style>
        `
      )}
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
                  @click=${() => this._setActiveTab(params.panel!)}
                >
                  ${params.text}
                </li>
              `
            )}
          </ul>
        </div>
        <div class="content">
          <slot class="panels"></slot>
        </div>
      </div>
    `;
  }
}
