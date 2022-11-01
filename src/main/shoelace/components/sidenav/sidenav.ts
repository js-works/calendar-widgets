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
    tabId: string;
    action?: string;
    text: string;
  }[];
}

// === Sidenav =======================================================

@customElement('sx-sidenav')
class Sidenav extends LitElement {
  static styles = sidenavStyles;

  @state()
  private _activeTabId = '';

  @property()
  menu: Sidenav.Menu = [];

  private _setActiveTab(tabId: string) {
    this._activeTabId = tabId;
    this.requestUpdate();
  }

  render() {
    const activeTabId = this._activeTabId || this.menu[0]?.tabId;

    return html`
      ${when(
        activeTabId,
        () => html`
          <style>
            ::slotted([data-tab='${activeTabId}']) {
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
                    active: params.tabId && params.tabId === activeTabId
                  })}
                  @click=${() => this._setActiveTab(params.tabId)}
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
