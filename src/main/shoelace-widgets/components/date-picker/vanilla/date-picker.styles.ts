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

  .cal-base--date-time,
  .cal-base--date-time-range {
    height: 17rem;
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

  .cal-title,
  .cal-prev,
  .cal-next {
    padding: 5px 0.75rem;
  }
  
  .cal-prev,
  .cal-next {
    display: flex;
    align-items: center;
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

  .cal-nav:not(.cal-nav--accentuated) .cal-title:not(.cal-title--disabled):hover,
  .cal-nav:not(.cal-nav--accentuated) .cal-prev:not(.cal-prev--disabled):hover,
  .cal-nav:not(.cal-nav--accentuated) .cal-next:not(.cal-next--disabled):hover {
    background-color: var(--cal-nav-hover-background-color);
  }

  .cal-nav:not(.cal-nav--accentuated) .cal-title:not(.cal-title--disabled):active,
  .cal-nav:not(.cal-nav--accentuated) .cal-prev:not(.cal-prev--disabled):active,
  .cal-nav:not(.cal-nav--accentuated) .cal-next:not(.cal-next--disabled):active {
    background-color: var(--cal-nav-active-background-color);
  }

  .cal-nav--accentuated {
    color: var(--cal-nav-accentuated-color);
    background-color: var(--cal-nav-accentuated-background-color);
  }

  .cal-nav--accentuated .cal-title:not(.cal-title--disabled):hover,
  .cal-nav--accentuated .cal-prev:not(.cal-prev--disabled):hover,
  .cal-nav--accentuated .cal-next:not(.cal-next--disabled):hover {
    background-color: var(--cal-nav-accentuated-hover-background-color);
  }

  .cal-nav--accentuated .cal-title:not(.cal-title--disabled):active,
  .cal-nav--accentuated .cal-prev:not(.cal-prev--disabled):active,
  .cal-nav--accentuated .cal-next:not(.cal-next--disabled):active {
    background-color: var(--cal-nav-accentuated-active-background-color);
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

  .cal-cell--adjacent:not(.cal-cell--selected):not(.cal-cell--disabled):not(:hover) {
    color: var(--cal-cell-adjacent-color);
  }

  .cal-cell--adjacent.cal-cell--disabled {
    color: var(--cal-cell-adjacent-disabled-color);
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

  .cal-cell--in-selection-range:not(.cal-cell--selected) {
    background-color: var(--cal-cell-selection-range-background-color);
  }

  .cal-cell--first-in-selection-range:not(.cal-cell--last-in-selection-range) {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  
  .cal-cell--last-in-selection-range:not(.cal-cell--first-in-selection-range) {
    border-top-right-radius: 6px; 
    border-bottom-right-radius: 6px;
  }

  .cal-week-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cal-time-links {
    min-height: 2em;
    display: flex;
    align-items: center;
    justify-items: center
    gap: 2em;
    padding: 0 2em;
    box-sizing: border-box;
    margin-bottom: 0.5em;
  }

  .cal-time-link {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
  }

  .cal-time-link--disabled {
    cursor: pointer;
    pointer-events: none;
  }

  .cal-time-range-arrow {
    margin: -0.75em 1rem -0.25em 1.5em;
    padding: 0;
  }

  .cal-time-selector {
    display: flex;
    flex-direction: column;
  }

  .cal-time {
    align-self: center;
    margin: 0.5rem 0 0 0;
    font-size: 125%;
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

  .cal-hours-headline,
  .cal-minutes-headline {
    margin: 0.5em 2rem 0 2rem;
    font-size: calc(100% - 1px);
  }

  .cal-hour-slider,
  .cal-minute-slider {
    margin: 1rem 2rem;
  }


  /* time sliders */

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    height: 0.75px;
    
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

  .cal-back-link {
    display: block;
    background-color: #ddf;
    padding: 0.5em 1em;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    background-color: var(--cal-back-link-background-color);
    border-radius: var(--cal-back-link-border-radius, 3px);
    margin: 1.5rem 2rem 0 2rem;
  }

  .cal-back-link:hover {
    background-color: var(--cal-back-link-hover-background-color);
  }
  
  .cal-back-link:active {
    background-color: var(--cal-back-link-active-background-color);
  }
`;
