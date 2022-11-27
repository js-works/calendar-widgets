export default /*css*/ `
  .cal-base {
    color: var(--cal-color);
    background-color: var(--cal-background-color);
    font-family: var(--cal-font-family);
    font-size: var(--cal-font-size);
    position: relative;
    display: flex;
    flex-direction: column;
    user-select: none;
    min-width: 20rem;
  }

  .cal-input {
    position: absolute;
    width: 0;
    height: 0;
    outline: none;
    border: none;
    overflow: hidden;
    opacity: 0;
    z-index: -1;
  }

  .cal-nav {
    display: flex;
    color: var(--cal-nav-color);
    background-color: var(--cal-nav-background-color);
  }

  .cal-nav--elevated {
    color: var(--cal-nav-elevated-color);
    background-color: var(--cal-nav-elevated-background-color);
  }

  .cal-title,
  .cal-prev,
  .cal-next {
    padding: 5px 0.75rem;
  }

  .cal-title {
    padding-left: 0.75em;
    padding-right: 0.75em;
    text-align: center;
    flex-grow: 1;
  }

  .cal-title:not(.cal-title--disabled),
  .cal-prev:not(.cal-prev--disabled),
  .cal-next:not(.cal-next--disabled) {
    cursor: pointer;
  }

  .cal-prev--disabled,
  .cal-next--disabled {
    visibility: hidden;
  }

  .cal-title:not(.cal-title--disabled):hover,
  .cal-prev:not(.cal-prev--disabled):hover,
  .cal-next:not(.cal-next--disabled):hover {
    background-color: var(--cal-nav-hover-background-color);
  }

  .cal-title:not(.cal-title--disabled):active,
  .cal-prev:not(.cal-prev--disabled):active,
  .cal-next:not(.cal-next--disabled):active {
    background-color: var(--cal-nav-active-background-color);
  }

  .cal-nav--elevated .cal-title:not(.cal-title--disabled):hover,
  .cal-nav--elevated .cal-prev:not(.cal-prev--disabled):hover,
  .cal-nav--elevated .cal-next:not(.cal-next--disabled):hover {
    background-color: var(--cal-nav-elevated-hover-background-color);
  }

  .cal-nav--elevated .cal-title:not(.cal-title--disabled):active,
  .cal-nav--elevated .cal-prev:not(.cal-prev--disabled):active,
  .cal-nav--elevated .cal-next:not(.cal-next--disabled):active {
    background-color: var(--cal-nav-elevated-active-background-color);
  }

  .cal-sheet {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    padding: 0.5em;
    min-height: 11rem;
  }

  .cal-sheet--month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 1.25em;
    flex-grow: 1;
  }

  .cal-sheet--month-with-week-numbers {
    grid-template-columns: repeat(8, 1fr);
  }

  .cal-sheet--year,
  .cal-sheet--decade,
  .cal-sheet--century {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-grow: 1;
  }

  .cal-weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 85%;
    text-transform: capitalize;
    margin: 0 0 0.25rem 0;
  }

  .cal-week-number {
    font-size: 70%;
    opacity: 75%;
    margin: 0 0.75em 0 0;
  }

  .cal-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.125em 0.75em;
    box-sizing: border-box;
    text-transform: capitalize;
    hyphens: auto;
  }

  .cal-cell--disabled {
    cursor: not-allowed;
    color: var(--cal-cell-disabled-color);
  }

  .cal-cell--highlighted {
    background-color: var(--cal-cell-highlighted-background-color);
  }

  .cal-cell--adjacent:not(.cal-cell--disabled):not(:hover) {
    color: var(--cal-cell-adjacent-color);
  }

  .cal-cell--adjacent.cal-cell--disabled {
    color: var(--cal-cell-adjacent-disabled-color);
  }

  .cal-cell--adjacent.cal-cell--selected:not(:hover) {
    color: var(--cal-cell-adjacent-selected-color);
  }

  .cal-cell--current-highlighted {
    background-color: var(--cal-cell-current-highlighted-background-color);
  }

  .cal-cell:hover:not(.cal-cell--disabled) {
    background-color: var(--cal-cell-hover-background-color);
  }

  .cal-cell--selected {
    color: var(--cal-cell-selected-color);
    background-color: var(--cal-cell-selected-background-color);
  }

  .cal-cell--selected:hover {
    background-color: var(
      --cal-cell-selected-hover-background-color
    ) !important;
  }

  .cal-cell--in-range:not(.cal-cell--selected) {
    background-color: var(--cal-cell-in-range-background-color);
  }

  .cal-week-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cal-time-range-arrow {
    margin: -0.75em 1rem -0.25em 1.5em;
    padding: 0;
  }

  .cal-time-selector-headline {
    margin: 0.75em 0 -0.75em 0.9em;
    font-size: 110%;
  }

  .cal-time-selector {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 0.75rem;
    padding: 0.125rem 0 0.75rem 0;
    margin: 0 1rem;
  }

  .cal-base--type-time .cal-time-selector {
    padding: 1.125rem 0.25rem calc(1rem + 5px) 0;
  }

  .cal-time {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    font-size: 115%;
    font-family: 'Century Gothic', CenturyGothic, AppleGothic,
      var(--cal-font-family);
    text-align: start;
    min-width: 3em;
  }

  .cal-time--has-day-period {
    min-width: 4em;
  }

  .cal-day-period {
    display: inline-block;
    font-size: 60%;
    text-align: left;
    margin-inline-start: 0.5em;
  }

  /* time sliders */

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    margin: 0.5em 0;
    height: 0.75px;
    padding: 0.5em 0;
    
    background-image: linear-gradient(
      var(--cal-slider-track-color),
      var(--cal-slider-track-color)
    );

    background-position: 0 50%;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    box-sizing: border-box;
    cursor: pointer;
    background-color: var(--cal-background-color);
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.25em;
    width: 1.25em;
    border-radius: var(--cal-slider-thumb-border-radius);
    background-color: var(--cal-slider-thumb-background-color);

    border: var(--cal-slider-thumb-border-width) solid
      var(--cal-slider-thumb-border-color);
  }

  input[type='range']::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.25em;
    width: 1.25em;
    border-radius: var(--cal-slider-thumb-border-radius);
    background-color: var(--cal-slider-thumb-background-color);
    border: var(--cal-slider-thumb-border-width) solid
      var(--cal-slider-thumb-border-color);
  }

  input[type='range']::-webkit-slider-thumb:hover {
    background-color: var(--cal-slider-thumb-hover-background-color);
    border-color: var(--cal-slider-thumb-hover-border-color);
  }

  input[type='range']::-moz-range-thumb:hover {
    background-color: var(--cal-slider-thumb-hover-background-color);
    border-color: var(--cal-slider-thumb-hover-border-color);
  }

  input[type='range']:focus::-webkit-slider-thumb {
    background-color: var(--cal-slider-thumb-focus-background-color);
    border-color: var(--cal-slider-thumb-focus-border-color);
  }

  input[type='range']:focus::-moz-range-thumb {
    background-color: var(--cal-slider-thumb-focus-background-color);
    border-color: var(--cal-slider-thumb-focus-border-color);
  }

  input[type='range']::-webkit-slider-runnable-track,
  input[type='range']::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
`;
