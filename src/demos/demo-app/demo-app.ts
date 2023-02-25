import { html, unsafeCSS, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { datePicker } from '../date-picker.demo';
import { dateFields } from '../date-field.demo';
import { formDemo } from '../form.demo';
import { dialogs } from '../dialogs.demo';
import { reactDemo } from '../react.demo';
import { preactDemo } from '../preact.demo';
import { loadPlugin } from 'shoelace-elements';

import {
  convertThemeToCss,
  customizeTheme,
  defaultTheme,
  lilTheme,
  ColorSetups,
  ThemeModifiers,
  Theme
} from 'shoelace-themes';

import SlDivider from '@shoelace-style/shoelace/dist/components/divider/divider';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlOption from '@shoelace-style/shoelace/dist/components/option/option';
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab';
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group';
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel';
import SlRadioButton from '@shoelace-style/shoelace/dist/components/radio-button/radio-button';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import { inlineValidationPlugin } from 'shoelace-elements/plugins';

import baseStyles from '../../main/shoelace-elements/styles/base-styles';
import demoStyles from './demo-app.styles';
import demoIcon from './demo-app.icon';

// @ts-ignore
import lightTheme from '@shoelace-style/shoelace/dist/themes/light.styles';
// @ts-ignore
import darkTheme from '@shoelace-style/shoelace/dist/themes/dark.styles';

const customThemes: Record<string, { name: string; theme: Theme }> = {
  'custom-light': {
    name: 'Custom (light)',
    theme: customizeTheme(
      defaultTheme,
      ThemeModifiers.builder()
        .colors(ColorSetups.skyBlue)
        .modern()
        .compact()
        .build()
    )
  },

  'custom-dark': {
    name: 'Custom (dark)',
    theme: customizeTheme(
      defaultTheme,
      ThemeModifiers.builder()
        .colors(ColorSetups.skyBlue)
        .modern()
        .compact()
        .dark()
        .build()
    )
  },
  'lil-theme-light': {
    name: 'Lil theme (light)',
    theme: lilTheme
  },
  'lil-theme-dark': {
    name: 'Lil theme (dark)',
    theme: customizeTheme(
      lilTheme,
      ThemeModifiers.builder() //
        .dark()
        .build()
    )
  },
  'lil-theme-custom-light': {
    name: 'Lil theme custom (light)',
    theme: customizeTheme(
      lilTheme,
      ThemeModifiers.builder() //
        .colors(ColorSetups.pink)
        .modern()
        .compact()
        .build()
    )
  },
  'lil-theme-custom-dark': {
    name: 'Lil theme custom (dark)',
    theme: customizeTheme(
      lilTheme,
      ThemeModifiers.builder() //
        .modern()
        .compact()
        .dark()
        .build()
    )
  }
};

function demo(content: string | Element) {
  return typeof content === 'string' ? unsafeHTML(content) : content;
}

@customElement('demo-app')
class DemoApp extends LitElement {
  static styles = [unsafeCSS(baseStyles), demoStyles];

  static {
    loadPlugin(inlineValidationPlugin('tooltip'));

    // required components (to prevent too much tree-shaking)
    void [
      SlDivider,
      SlIcon,
      SlOption,
      SlRadioButton,
      SlRadioGroup,
      SlSelect,
      SlTab,
      SlTabGroup,
      SlTabPanel
    ];
  }

  private _activeTab: string;
  private _activeTheme: string;

  constructor() {
    super();

    this._activeTab = location.hash
      ? location.hash.substring(1).split('/')[0] || ''
      : '';

    let activeTheme = location.hash
      ? location.hash.substring(1).split('/')[1] || ''
      : '';

    if (!customThemes.hasOwnProperty(activeTheme) && activeTheme !== 'dark') {
      activeTheme = 'light';
    }

    this._activeTheme = activeTheme;

    this._updateTheme();
  }

  private _updateTheme = () => {
    const theme = customThemes.hasOwnProperty(this._activeTheme)
      ? convertThemeToCss(customThemes[this._activeTheme].theme, ':root')
      : this._activeTheme === 'dark'
      ? darkTheme.toString().replace(':host', ':root')
      : lightTheme.toString();

    const styleElem = document.createElement('style');

    document.getElementById('shoelace-theme')?.remove();
    styleElem.id = 'shoelace-theme';
    styleElem.innerText = theme;
    document.head.append(styleElem);
  };

  private _onTabShow = (ev: { detail: { name: string } }) => {
    this._activeTab = ev.detail.name;
    location.hash = `${this._activeTab}/${this._activeTheme}`;
  };

  private _onThemeChange = (ev: any) => {
    this._activeTheme = ev.target.value;
    location.hash = `${this._activeTab}/${this._activeTheme}`;
    this._updateTheme();
  };

  render() {
    return html`
      <div class="base" @sl-tab-show=${this._onTabShow}>
        <div class="header">
          <sl-icon src=${demoIcon} class="header-icon"></sl-icon>
          <div class="header-title">Shoelace Elements - Demo</div>
          <sl-select
            class="theme-selector label-on-left"
            label="Theme"
            size="small"
            value=${this._activeTheme}
            @sl-change=${this._onThemeChange}
          >
            <sl-option value="light">Standard (light)</sl-option>
            <sl-option value="dark">Standard (dark)</sl-option>
            <sl-divider></sl-divider>
            ${repeat(
              Object.entries(customThemes),
              ([key, { name }]) => html`
                <sl-option value=${key}>${name}</sl-option>
              `
            )}
          </sl-select>
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
            panel="forms"
            ?active=${this._activeTab === 'forms'}
          >
            Forms
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="dialogs"
            ?active=${this._activeTab === 'dialogs'}
          >
            Dialogs+Toasts
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="react-demo"
            ?active=${this._activeTab === 'react-demo'}
          >
            React
          </sl-tab>
          <sl-tab
            slot="nav"
            panel="preact-demo"
            ?active=${this._activeTab === 'preact-demo'}
          >
            Preact
          </sl-tab>
          <sl-tab-panel name="date-picker">
            ${demo(datePicker())}
          </sl-tab-panel>
          <sl-tab-panel name="date-fields">
            ${demo(dateFields())}
          </sl-tab-panel>
          <sl-tab-panel name="dialogs">${demo(dialogs())}</sl-tab-panel>
          <sl-tab-panel name="forms">${demo(formDemo())}</sl-tab-panel>
          <sl-tab-panel name="react-demo">${demo(reactDemo())}</sl-tab-panel>
          <sl-tab-panel name="preact-demo">${demo(preactDemo())}</sl-tab-panel>
        </sl-tab-group>
      </div>
    `;
  }
}

document.getElementById('app')!.innerHTML = '<demo-app></demo-app>';
