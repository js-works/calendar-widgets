import {
  getHourMinuteString,
  getYearMonthDayString,
  getYearMonthString,
  getYearString
} from './calendar-utils';

export { DatePickerController };

namespace DatePickerController {
  export type SelectionMode =
    | 'date'
    | 'dates'
    | 'dateTime'
    | 'dateRange'
    | 'time'
    | 'timeRange'
    | 'dateTimeRange'
    | 'week'
    | 'weeks'
    | 'month'
    | 'months'
    | 'monthRange'
    | 'year'
    | 'years'
    | 'yearRange';

  export type View =
    | 'time1'
    | 'time2'
    | 'timeRange1'
    | 'timeRange2'
    | 'month'
    | 'year'
    | 'decade'
    | 'century';
}

class DatePickerController {
  #oldSelectionMode: DatePickerController.SelectionMode;
  readonly #getSelectionMode: () => DatePickerController.SelectionMode;
  readonly #_selection = new Set<string>();
  readonly #requestUpdate: () => void;
  readonly #onChange: (() => void) | null;

  #_view: DatePickerController.View = 'month';
  #activeYear = new Date().getFullYear();
  #activeMonth = new Date().getMonth();
  #activeHour = 0;
  #activeMinute = 0;
  #activeHour2 = 0;
  #activeMinute2 = 0;
  #notifyTimeoutId: unknown = null;

  get #selectionMode() {
    return this.#checkSelectionMode();
  }

  get #selection() {
    this.#checkSelectionMode();
    return this.#_selection;
  }

  get #view() {
    this.#checkSelectionMode();
    return this.#_view;
  }

  set #view(value: DatePickerController.View) {
    this.#_view = value;
  }

  constructor(
    root: HTMLElement | Promise<HTMLElement>,
    params: {
      getSelectionMode: () => DatePickerController.SelectionMode;
      requestUpdate: () => void;
      onChange?: () => void;
    }
  ) {
    (root instanceof HTMLElement ? Promise.resolve(root) : root).then((root) =>
      this.#addEventListeners(root.shadowRoot ? root.shadowRoot : root)
    );

    let updateRequested = false;

    this.#requestUpdate = () => {
      if (updateRequested) {
        return;
      }

      updateRequested = true;

      setTimeout(() => {
        updateRequested = false;
        params.requestUpdate();
      }, 50);
    };

    this.#oldSelectionMode = params.getSelectionMode();
    this.#getSelectionMode = params.getSelectionMode;
    this.#onChange = params.onChange || null;
  }

  resetView() {
    this.#view =
      this.#selectionMode === 'year' ||
      this.#selectionMode === 'years' ||
      this.#selectionMode === 'yearRange'
        ? 'decade'
        : this.#selectionMode === 'month' ||
          this.#selectionMode === 'months' ||
          this.#selectionMode === 'monthRange'
        ? 'year'
        : this.#selectionMode === 'time'
        ? 'time1'
        : this.#selectionMode === 'timeRange'
        ? 'timeRange1'
        : 'month';

    this.#activeYear = new Date().getFullYear();
    this.#activeMonth = new Date().getMonth();
    this.#requestUpdate();
  }

  getView(): DatePickerController.View {
    return this.#view;
  }

  isTimeVisible(): boolean {
    return this.#selectionMode === 'time' || this.#selectionMode === 'dateTime';
  }

  getActiveYear() {
    return this.#activeYear;
  }

  getActiveMonth() {
    return this.#activeMonth;
  }

  getActiveHour() {
    return this.#activeHour;
  }

  getActiveMinute() {
    return this.#activeMinute;
  }

  getActiveHour2() {
    return this.#activeHour2;
  }

  getActiveMinute2() {
    return this.#activeMinute2;
  }

  getSelectionSize() {
    return this.#selection.size;
  }

  hasSelectedYear(year: number) {
    return this.#selection.has(getYearString(year));
  }

  hasSelectedMonth(year: number, month: number) {
    return this.#selection.has(getYearMonthString(year, month));
  }

  hasSelectedDay(year: number, month: number, day: number, week: string) {
    const mode = this.#selectionMode;

    if (
      mode === 'date' ||
      mode === 'dates' ||
      mode === 'dateTime' ||
      mode === 'dateRange' ||
      mode === 'dateTimeRange'
    ) {
      const value = this.#selectionMode;
      return this.#selection.has(getYearMonthDayString(year, month, day));
    } else if (mode === 'week' || mode === 'weeks') {
      return this.#selection.has(week);
    }

    return false;
  }

  getValue() {
    const selectedItems = [...this.#selection].sort();

    if (
      this.#selectionMode === 'dateRange' ||
      this.#selectionMode === 'monthRange' ||
      this.#selectionMode === 'yearRange'
    ) {
      return selectedItems.join('|');
    } else if (this.#selectionMode === 'dateTimeRange') {
      const selectionSize = selectedItems.length;

      if (selectionSize === 0) {
        return '';
      }

      let ret =
        selectedItems[0] +
        'T' +
        getHourMinuteString(this.#activeHour, this.#activeMinute);

      if (selectionSize > 1) {
        ret +=
          '|' +
          selectedItems[1] +
          'T' +
          getHourMinuteString(this.#activeHour2, this.#activeMinute2);
      }

      return ret;
    } else if (this.#selectionMode === 'dateTime') {
      const dateString = selectedItems[0];

      const timeString = getHourMinuteString(
        this.#activeHour,
        this.#activeMinute
      );

      return !dateString ? '' : `${dateString}T${timeString}`;
    } else if (this.#selectionMode === 'time') {
      return getHourMinuteString(this.#activeHour, this.#activeMinute);
    } else if (this.#selectionMode === 'timeRange') {
      return (
        getHourMinuteString(this.#activeHour, this.#activeMinute) +
        '|' +
        getHourMinuteString(this.#activeHour2, this.#activeMinute2)
      );
    } else {
      return selectedItems.join(',');
    }
  }

  setValue(value: string) {
    if (value === '') {
      this.#selection.clear();
      this.#activeHour = 0;
      this.#activeMinute = 0;
      this.#activeHour2 = 0;
      this.#activeMinute2 = 0;
    } else {
      // TODO!!!!
    }
  }

  #clearSelection() {
    this.#selection.clear();
    this.#notifyChange();
  }

  #addSelection(value: string) {
    this.#selection.add(value);
    this.#notifyChange();
  }

  #removeSelection(value: string) {
    this.#selection.delete(value);
    this.#notifyChange();
  }

  #notifyChange() {
    if (!this.#onChange || this.#notifyTimeoutId !== null) {
      return;
    }

    this.#notifyTimeoutId = setTimeout(() => {
      this.#notifyTimeoutId = null;

      if (this.#onChange) {
        this.#onChange();
      }
    }, 50);
  }

  #addEventListeners = (root: HTMLElement | ShadowRoot) => {
    root.addEventListener('change', (ev: Event) => {
      if (ev.target !== root) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    });

    root.addEventListener('input', (ev: Event) => {
      const target = ev.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const subject = this.#getSubject(target);

      if (!subject) {
        return;
      }

      switch (subject) {
        case 'hours':
          this.#setActiveHours(
            parseInt(
              String((target as unknown as { value: string | number }).value),
              10
            )
          );

          this.#notifyChange();
          break;

        case 'minutes':
          this.#setActiveMinutes(
            parseInt(
              String((target as unknown as { value: string | number }).value),
              10
            )
          );

          this.#notifyChange();
          break;

        case 'hours2':
          this.#setActiveHours2(
            parseInt(
              String((target as unknown as { value: string | number }).value),
              10
            )
          );

          this.#notifyChange();
          break;

        case 'minutes2':
          this.#setActiveMinutes2(
            parseInt(
              String((target as unknown as { value: string | number }).value),
              10
            )
          );

          this.#notifyChange();
          break;
      }

      ev.preventDefault();
      ev.stopPropagation();
    });

    root.addEventListener('mousedown', (ev: Event) => {
      const target = ev.target;
      let preventDefault = true;

      if (target instanceof HTMLElement) {
        const subject = this.#getSubject(target);

        if (subject === 'hour' || subject === 'minute') {
          preventDefault = false;
        }
      }

      if (preventDefault) {
        //ev.preventDefault();
        //ev.stopPropagation();
      }
    });

    root.addEventListener('click', (ev: Event) => {
      const target = ev.target;

      if (!(target instanceof Element)) {
        return;
      }

      const subject = this.#getSubject(target);

      if (!subject) {
        return;
      }

      switch (subject) {
        case 'prev':
          this.#clickPrev();
          break;

        case 'next':
          this.#clickNext();
          break;

        case 'title':
          this.#clickTitle();
          break;

        case 'day': {
          const [year, month, day] = target
            .getAttribute('data-date')!
            .split('-')
            .map((it) => parseInt(it, 10));

          const week = target.getAttribute('data-week')!;

          this.#clickDay(year, month - 1, day, week);
          break;
        }

        case 'month': {
          const [year, month] = target
            .getAttribute('data-month')!
            .split('-')
            .map((it) => parseInt(it, 10));

          this.#clickMonth(year, month - 1);
          break;
        }

        case 'year': {
          const year = parseInt(target.getAttribute('data-year')!, 10);

          this.#clickYear(year);
          break;
        }

        case 'decade': {
          const year = parseInt(target.getAttribute('data-year')!, 10);

          this.#clickDecade(year);
          break;
        }

        case 'time1': {
          this.#setView('time1');
          break;
        }

        case 'time2': {
          this.#setView('time2');
          break;
        }

        case 'timeRange1': {
          this.#setView('timeRange1');
          break;
        }

        case 'timeRange2': {
          this.#setView('timeRange2');
          break;
        }

        case 'view-month': {
          this.#setView('month');
          break;
        }
      }

      ev.preventDefault();
      ev.stopPropagation();
    });
  };

  #toggleSelected = (value: string, clear = false) => {
    const hasValue = this.#selection.has(value);

    if (clear) {
      this.#clearSelection();
    }

    if (!hasValue) {
      this.#addSelection(value);
    } else if (!clear) {
      this.#removeSelection(value);
    }

    this.#requestUpdate();
  };

  #clickPrev = () => {
    this.#clickPrevOrNext(-1);
  };

  #clickNext = () => {
    this.#clickPrevOrNext(1);
  };

  #clickPrevOrNext = (signum: number) => {
    switch (this.#view) {
      case 'month': {
        let n = this.#activeYear * 12 + this.#activeMonth + signum;

        this.#activeYear = Math.floor(n / 12);
        this.#activeMonth = n % 12;
        break;
      }

      case 'year':
        this.#activeYear += signum;
        break;

      case 'decade':
        this.#activeYear += signum * 10;
        break;

      case 'century':
        this.#activeYear += signum * 100;
        break;
    }

    this.#requestUpdate();
  };

  #checkSelectionMode = () => {
    const selectionMode = this.#getSelectionMode();

    if (selectionMode === this.#oldSelectionMode) {
      return selectionMode;
    }

    this.#oldSelectionMode = selectionMode;
    this.#clearSelection();

    switch (selectionMode) {
      case 'year':
      case 'years':
      case 'yearRange':
        this.#view = 'decade';
        break;

      case 'month':
      case 'months':
      case 'monthRange':
        this.#view = 'year';
        break;

      case 'time':
        this.#view = 'time1';
        break;

      case 'timeRange':
        this.#view = 'timeRange1';
        break;

      default:
        this.#view = 'month';
    }

    this.#requestUpdate();
    return selectionMode;
  };

  #setView = (view: DatePickerController.View) => {
    this.#view = view;
    this.#requestUpdate();
  };

  #setActiveHours = (hour: number) => {
    this.#activeHour = hour;
    this.#activeHour2 = Math.max(this.#activeHour, this.#activeHour2);

    if (this.#activeHour === this.#activeHour2) {
      this.#activeMinute2 = Math.max(this.#activeMinute, this.#activeMinute2);
    }

    this.#requestUpdate();
  };

  #setActiveMinutes = (minute: number) => {
    this.#activeMinute = minute;

    if (this.#selectionMode === 'timeRange') {
      this.#activeHour2 = Math.max(this.#activeHour, this.#activeHour2);

      if (this.#activeHour === this.#activeHour2) {
        this.#activeMinute2 = Math.max(this.#activeMinute, this.#activeMinute2);
      }
    }

    this.#requestUpdate();
  };

  #setActiveHours2 = (hour: number) => {
    this.#activeHour2 = hour;

    if (this.#selectionMode === 'timeRange') {
      this.#activeHour = Math.min(this.#activeHour, this.#activeHour2);

      if (this.#activeHour === this.#activeHour2) {
        this.#activeMinute = Math.min(this.#activeMinute, this.#activeMinute2);
      }
    }

    this.#requestUpdate();
  };

  #setActiveMinutes2 = (minute: number) => {
    this.#activeMinute2 = minute;
    this.#activeHour = Math.min(this.#activeHour, this.#activeHour2);

    if (this.#activeHour === this.#activeHour2) {
      this.#activeMinute = Math.min(this.#activeMinute, this.#activeMinute2);
    }

    this.#requestUpdate();
  };

  #clickTitle = () => {
    if (
      this.#view !== 'month' &&
      this.#view !== 'year' &&
      this.#view !== 'decade'
    ) {
      return;
    }

    this.#setView(
      this.#view === 'month'
        ? 'year'
        : this.#view === 'year'
        ? 'decade'
        : 'century'
    );
  };

  #clickDay = (year: number, month: number, day: number, week: string) => {
    switch (this.#selectionMode) {
      case 'date':
      case 'dates':
      case 'dateTime': {
        const dateString = getYearMonthDayString(year, month, day);

        this.#toggleSelected(dateString, this.#selectionMode !== 'dates');
        break;
      }

      case 'dateRange':
      case 'dateTimeRange': {
        const dateString = getYearMonthDayString(year, month, day);

        if (this.#selection.has(dateString)) {
          this.#removeSelection(dateString);
        } else if (this.#selection.size > 1) {
          this.#selection.clear();
          this.#addSelection(dateString);
        } else {
          this.#addSelection(dateString);
        }

        break;
      }

      case 'week':
      case 'weeks': {
        this.#toggleSelected(week, this.#selectionMode !== 'weeks');
        break;
      }
    }

    this.#requestUpdate();
  };

  #clickMonth = (year: number, month: number) => {
    if (
      this.#selectionMode !== 'month' &&
      this.#selectionMode !== 'months' &&
      this.#selectionMode !== 'monthRange'
    ) {
      this.#activeYear = year;
      this.#activeMonth = month;
      this.#view = 'month';
    } else {
      const monthString = getYearMonthString(year, month);

      switch (this.#selectionMode) {
        case 'month':
          this.#toggleSelected(monthString, true);
          break;

        case 'months':
          this.#toggleSelected(monthString);
          break;

        case 'monthRange':
          if (this.#selection.has(monthString)) {
            this.#removeSelection(monthString);
          } else if (this.#selection.size > 1) {
            this.#selection.clear();
            this.#addSelection(monthString);
          } else {
            this.#addSelection(monthString);
          }

          break;
      }
    }

    this.#requestUpdate();
  };

  #clickYear = (year: number) => {
    if (
      this.#selectionMode !== 'year' &&
      this.#selectionMode !== 'years' &&
      this.#selectionMode !== 'yearRange'
    ) {
      this.#activeYear = year;
      this.#view = 'year';
    } else {
      const yearString = getYearString(year);

      switch (this.#selectionMode) {
        case 'year':
          this.#toggleSelected(yearString, true);
          break;

        case 'years':
          this.#toggleSelected(yearString);
          break;

        case 'yearRange':
          if (this.#selection.has(yearString)) {
            this.#removeSelection(yearString);
          } else if (this.#selection.size > 1) {
            this.#selection.clear();
            this.#addSelection(yearString);
          } else {
            this.#addSelection(yearString);
          }

          break;
      }
    }

    this.#requestUpdate();
  };

  #clickDecade = (firstYear: number) => {
    this.#activeYear = firstYear;
    this.#view = 'decade';
    this.#requestUpdate();
  };

  #getSubject(elem: Element): string {
    return elem.closest('[data-subject]')?.getAttribute('data-subject') || '';
  }
}
