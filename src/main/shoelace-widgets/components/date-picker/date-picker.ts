import { css, html, unsafeCSS, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LocalizeController } from '@shoelace-style/localize/dist/index';
import { DatePicker as Picker } from './vanilla/date-picker';
import { dateAttributeConverter } from '../../utils/attribute-converters';

// === exports =======================================================

export { DatePicker };

// === exported types ================================================

namespace DatePicker {
  export type SelectionMode = Picker.SelectionMode;
}

// === styles  =======================================================

const datePickerCustomStyles = css`
  .base {
    --cal-font-family: var(--sl-font-sans);
    --cal-font-size: var(--sl-font-size-medium);
    --cal-color: var(--sl-color-neutral-1000);
    --cal-backgroundColor: transparent;
    --cal-nav-color: var(--sl-color-neutral-1000);
    --cal-nav-background-color: transparent;
    --cal-nav-hover-background-color: var(--sl-color-primary-300);
    --cal-nav-active-background-color: var(--sl-color-primary-400);
    --cal-nav-accentuated-color: var(--sl-color-neutral-0);
    --cal-nav-accentuated-background-color: var(--sl-color-primary-600);
    --cal-nav-accentuated-hover-background-color: var(--sl-color-primary-700);
    --cal-nav-accentuated-active-background-color: var(--sl-color-primary-800);
    --cal-cell-hover-background-color: var(--sl-color-primary-200);
    --cal-cell-disabled-color: var(--sl-color-neutral-300);
    --cal-cell-highlighted-background-color: var(--sl-color-neutral-50);
    --cal-cell-adjacent-color: var(--sl-color-neutral-400);
    --cal-cell-adjacent-disabled-color: var(--sl-color-neutral-200);
    --cal-cell-adjacent-selected-color: var(--sl-color-neutral-800);

    --cal-cell-current-highlighted-background-color: var(
      --sl-color-neutral-200
    );

    --cal-cell-selected-color: var(--sl-color-neutral-0);
    --cal-cell-selected-background-color: var(--sl-color-primary-500);
    --cal-cell-selected-hover-background-color: var(--sl-color-primary-600);
    --cal-cell-selection-range-background-color: var(--sl-color-primary-100);
    --cal-slider-thumb-background-color: var(--sl-color-neutral-0);
    --cal-slider-thumb-border-color: var(--sl-color-neutral-400);
    --cal-slider-thumb-border-width: 1px;
    --cal-slider-thumb-border-radius: 50%;
    --cal-slider-thumb-hover-background-color: var(--sl-color-neutral-0);
    --cal-slider-thumb-hover-border-color: var(--sl-color-neutral-1000);
    --cal-slider-thumb-focus-background-color: var(--sl-color-primary-600);
    --cal-slider-thumb-focus-border-color: var(--sl-color-primary-600);
    --cal-slider-track-color: var(--sl-color-neutral-400);
    --cal-back-link-background-color: var(--sl-color-primary-200);
    --cal-back-link-hover-background-color: var(--sl-color-primary-300);
    --cal-back-link-active-background-color: var(--sl-color-primary-400);
    --cal-back-link-border-radius: var(--sl-border-radius-medium);
  }
`;

// === components ====================================================

@customElement('sx-date-picker')
class DatePicker extends LitElement {
  static styles = [unsafeCSS(Picker.styles), datePickerCustomStyles];

  @property()
  get value(): string {
    return this._picker.getValue();
  }

  set value(value: string) {
    this._picker.setValue(value);
  }

  @property({ type: String, attribute: 'selection-mode' })
  selectionMode: DatePicker.SelectionMode = 'date';

  @property({ type: Boolean, attribute: 'accentuate-header' })
  accentuateHeader = false;

  @property({ type: Boolean, attribute: 'show-week-numbers' })
  showWeekNumbers = false;

  @property({ type: String, attribute: 'calendar-size' })
  calendarSize: 'default' | 'minimal' | 'maximal' = 'default';

  @property({ type: Boolean, attribute: 'highlight-today' })
  highlightToday = false;

  @property({ type: Boolean, attribute: 'highlight-weekends' })
  highlightWeekends = false;

  @property({ type: Boolean, attribute: 'disable-weekends' })
  disableWeekends = false;

  @property({ type: Boolean, attribute: 'enable-century-view' })
  enableCenturyView = false;

  @property({ converter: dateAttributeConverter, attribute: 'min-date' })
  minDate: Date | null = null;

  @property({ converter: dateAttributeConverter, attribute: 'max-date' })
  maxDate: Date | null = null;

  @property()
  lang = '';

  @property()
  dir = '';

  private _picker: Picker;
  private _containerRef = createRef<HTMLDivElement>();
  private _localize = new LocalizeController(this);

  constructor() {
    super();

    this._picker = new Picker(this, {
      requestUpdate: () => this.requestUpdate(),
      getSelectionMode: () => this.selectionMode,
      onChange: this._onChange,
      getLocale: () => this._localize.lang(),
      getDirection: () => this._localize.dir(),
      getProps: () => this
    });
  }

  private _onChange = () => {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  shouldUpdate() {
    if (!this.hasUpdated) {
      return true;
    }

    this._picker.render(this._containerRef.value!);
    return false;
  }

  resetView() {
    this._picker.resetView();
  }

  render() {
    return html`
      <div class="base" ${ref(this._containerRef)}>
        ${unsafeHTML(this._picker.renderToString())}
      </div>
    `;
  }
}
