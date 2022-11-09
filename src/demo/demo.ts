import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { unsafeHTML } from 'lit/directives/unsafe-html';
import { datePicker } from '../stories/date-picker.stories';
import { dateFields } from '../stories/date-field.stories';
import { dialogs } from '../stories/dialogs.stories';
import { toasts } from '../stories/toasts.stories';

import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab';
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group';
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel';

import demoIcon from './demo.icon';

const styles = css`
  .base {
    display: flex;
    flex-direction: column;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-normal);
    max-height: 100%;
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    padding: 0.75rem 1rem;
    border: 0 solid var(--sl-color-neutral-200);
    border-bottom-width: 1px;
    box-shadow: var(--sl-shadow-x-large);
  }

  .header-icon {
    color: var(--sl-color-orange-500);
    font-size: 150%;
  }

  .content {
    padding: 2rem 1rem;
    overflow: auto;
    box-sizing: border-box;
    flex-grow: 1;
    min-height: 100;
  }

  sl-tab-panel {
    padding: 0 1rem;
    box-sizing: border-box;
  }
`;

@customElement('demo-app')
class DemoApp extends LitElement {
  static styles = styles;

  static {
    // required components (to prevent too much tree-shaking)
    void [SlIcon, SlTab, SlTabGroup, SlTabPanel];
  }

  private _onTabShow = (ev: { detail: { name: string } }) => {
    location.hash = ev.detail.name;
  };

  render() {
    const activeTab = this.hasUpdated
      ? null
      : location.hash
      ? location.hash.substring(1)
      : null;

    return html`
      <div class="base" @sl-tab-show=${this._onTabShow}>
        <div class="header">
          <sl-icon src=${demoIcon} class="header-icon"></sl-icon>
          Shoelace Widgets - Demo
        </div>
        <sl-tab-group placement="start" class="content">
          <sl-tab
            slot="nav"
            panel="date-picker"
            ?active=${activeTab === 'date-picker'}
          >
            Date picker
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="date-fields"
            ?active=${activeTab === 'date-fields'}
          >
            Date fields
          </sl-tab>
          <sl-tab slot="nav" panel="dialogs" ?active=${activeTab === 'dialogs'}>
            Dialogs
          </sl-tab>
          <sl-tab slot="nav" panel="toasts" ?active=${activeTab === 'toasts'}
            >Toasts</sl-tab
          >
          <sl-tab-panel name="date-picker">
            ${unsafeHTML(datePicker())}
          </sl-tab-panel>
          <sl-tab-panel name="date-fields">
            ${unsafeHTML(dateFields())}
          </sl-tab-panel>
          <sl-tab-panel name="dialogs">${unsafeHTML(dialogs())}</sl-tab-panel>
          <sl-tab-panel name="toasts">${unsafeHTML(toasts())}</sl-tab-panel>
        </sl-tab-group>
      </div>
    `;
  }
}

document.getElementById('app')!.innerHTML = '<demo-app></demo-app>';
