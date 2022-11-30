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
    box-sizing: border-box;
  }

  .cal-view--date-time,
  .cal-view--date-time-range {
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 0 3em;
    min-height: 2em;
    box-sizing: border-box;
    margin-bottom: 0.5em;
  }
  
  .cal-time-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
  }

  .cal-time-link--disabled {
    pointer-events: none;
  }

  .cal-time-link:first-child {
    grid-column: 1;
    justify-self: start;
  }
  
  .cal-time-link:nth-child(2) {
    justify-self: end;
    grid-column: 2;
  }

  .cal-time-sliders {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  }

  .cal-time {
    margin: 0.5rem 0 0 0;
  }

  .cal-time-header {
    grid-area: header;
    font-size: calc(100% - 1px);
    margin-bottom: 0.25em;
    font-weight: 200;
    align-self: start;
  }

  .cal-time-value {
    grid-area: time;
    align-self: center; 
    justify-self: start;
    font-size: 150%;
  }

  .cal-hours-headline,
  .cal-minutes-headline {
    margin: 0.5em 2rem 0 2rem;
    font-size: calc(100% - 1px);
    padding: 0;
  }

  .cal-hour-slider,
  .cal-minute-slider {
    margin: 1rem 2rem;
  }

  .cal-time-and-sliders {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5em;
  }

  :where(.cal-view--time1, .cal-view--time2) .cal-time {
    text-align: center;
  }
  
  :where(.cal-view--time-range1, .cal-view--time-range-2) .cal-time--2 {
    font-size: 70% !important;
  }
  
  :where(.cal-view--time-range1, .cal-view--time-range-2) .cal-time--1 {
    padding: 0 0 1em 2em;
  }

  .cal-view--time-range1 .cal-time--2:hover {
    background-color: var(--sl-color-primary-50);
    cursor: pointer;
  }

  .cal-time-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  .cal-time--1,
  .cal-time--2 {
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


  .cal-time-range--time1 > :nth-child(2) {
    font-size: 75%;
    border: 0 solid #aaa; /* TODO!!! */
    border-width: 0 0 1px 1px;
    padding: 1em;
    margin: 1em;
    flex-grow: 5;
  }
  
  .cal-time-range--time2 {
    display: flex;
  }
`;
