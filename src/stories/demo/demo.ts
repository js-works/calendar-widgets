import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { unsafeHTML } from 'lit/directives/unsafe-html';
import { datePicker } from '../date-picker.stories';
import { dateFields } from '../date-field.stories';
import { dialogs } from '../dialogs.stories';
import { toasts } from '../toasts.stories';

import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab';
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group';
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel';
import SlRadioButton from '@shoelace-style/shoelace/dist/components/radio-button/radio-button';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group';

import demoStyles from './demo.styles';
import demoIcon from './demo.icon';

// @ts-ignore
import lightTheme from '@shoelace-style/shoelace/dist/themes/light.styles';
// @ts-ignore
import darkTheme from '@shoelace-style/shoelace/dist/themes/dark.styles';

@customElement('demo-app')
class DemoApp extends LitElement {
  static styles = demoStyles;

  static {
    // required components (to prevent too much tree-shaking)
    void [SlIcon, SlRadioButton, SlRadioGroup, SlTab, SlTabGroup, SlTabPanel];
  }

  private _activeTab: string;
  private _theme: 'light' | 'dark';

  constructor() {
    super();

    this._activeTab = location.hash
      ? location.hash.substring(1).split('/')[0] || ''
      : '';

    this._theme =
      (location.hash
        ? location.hash.substring(1).split('/')[1] || 'light'
        : 'light') === 'dark'
        ? 'dark'
        : 'light';

    this._updateTheme();
  }

  private _updateTheme = () => {
    const theme = this._theme === 'dark' ? darkTheme : lightTheme;
    const styleElem = document.createElement('style');

    document.getElementById('shoelace-theme')?.remove();
    styleElem.id = 'shoelace-theme';
    styleElem.innerText = theme.toString().replace(':host', ':root');
    document.head.append(styleElem);
  };

  private _onTabShow = (ev: { detail: { name: string } }) => {
    this._activeTab = ev.detail.name;
    location.hash = `${this._activeTab}/${this._theme}`;
  };

  private _onThemeChange = (ev: any) => {
    this._theme = ev.target.value;
    location.hash = `${this._activeTab}/${this._theme}`;
    this._updateTheme();
  };

  render() {
    return html`
      <div class="base" @sl-tab-show=${this._onTabShow}>
        <div class="header">
          <sl-icon src=${demoIcon} class="header-icon"></sl-icon>
          <div class="header-title">Shoelace Widgets - Demo</div>
          <sl-radio-group
            id="theme-selector"
            value=${this._theme}
            @sl-change=${this._onThemeChange}
          >
            <sl-radio-button size="small" value="light">Light</sl-radio-button>
            <sl-radio-button size="small" value="dark">Dark</sl-radio-button>
          </sl-radio-group>
        </div>
        <sl-tab-group placement="start" class="content">
          <sl-tab
            slot="nav"
            panel="date-picker"
            ?active=${this._activeTab === 'date-picker'}
          >
            Date picker
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="date-fields"
            ?active=${this._activeTab === 'date-fields'}
          >
            Date fields
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="dialogs"
            ?active=${this._activeTab === 'dialogs'}
          >
            Dialogs
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="toasts"
            ?active=${this._activeTab === 'toasts'}
          >
            Toasts
          </sl-tab>
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
