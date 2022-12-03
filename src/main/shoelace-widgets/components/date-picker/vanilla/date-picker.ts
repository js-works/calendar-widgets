import { Calendar, Sheet, SheetItem } from './calendar';
import { h, render, renderToString } from './vdom';
import { classMap } from './utils';
import { I18n } from './i18n';
import { selectionModeMeta, calendarViewOrder } from './meta';

// types
import type { VNode } from './vdom';
import type { CalendarView, View } from './meta';
import type { SelectionMode, SelectionMode as _SelectionMode } from './meta';

// icons
import arrowLeftIcon from './icons/arrow-left.icon';
import arrowRightIcon from './icons/arrow-right.icon';
import timeIcon from './icons/time.icon';

// styles
import datePickerBaseStyles from './date-picker.styles';

// === exports =======================================================

export { DatePicker };

// === exported types ================================================

namespace DatePicker {
  export type SelectionMode = _SelectionMode;

  export type Props = {
    selectionMode: SelectionMode;
    accentuateHeader: boolean;
    showWeekNumbers: boolean;
    calendarSize: 'default' | 'minimal' | 'maximal';
    highlightCurrent: boolean;
    highlightWeekends: boolean;
    disableWeekends: boolean;
    enableCenturyView: boolean;
    minDate: Date | null;
    maxDate: Date | null;
  };
}

// === local VDOM factories ==========================================

const [a, div, input] = ['a', 'div', 'input'].map((tag) => h.bind(null, tag));

// === exported classes ==============================================

class DatePicker {
  static styles = datePickerBaseStyles;

  #i18n: I18n;
  #calendar: Calendar;
  #getProps: () => DatePicker.Props;
  #requestUpdate: () => void;
  #onChange: () => void;

  #selection = new Set<string>();
  #activeYear = new Date().getFullYear();
  #activeMonth = new Date().getMonth();
  #activeHour1 = 0;
  #activeHour2 = 0;
  #activeMinute1 = 0;
  #activeMinute2 = 0;
  #view: View = 'month';
  #selectionMode: SelectionMode = 'date';
  #sheet: Sheet | null = null;

  constructor(params: {
    getLocale: () => string;
    getDirection: () => string;
    getProps: () => DatePicker.Props; //
    requestUpdate: () => void;
    onChange: () => void;
  }) {
    this.#i18n = new I18n(params.getLocale);
    this.#calendar = new Calendar(this.#i18n.getLocale());
    this.#getProps = params.getProps;
    this.#requestUpdate = params.requestUpdate;
    this.#onChange = params.onChange;
  }

  render(target: HTMLElement) {
    render(this.#renderDatePicker(), target);
  }

  renderToString() {
    return renderToString(this.#renderDatePicker());
  }

  getValue() {
    const { kind, mapSelectionKeys } = selectionModeMeta[this.#selectionMode];

    if (kind !== 'time') {
      let selectionKeys = [...this.#selection].sort();

      if (selectionKeys.length > 0 && mapSelectionKeys) {
        selectionKeys = mapSelectionKeys({
          selectionKeys: selectionKeys,
          hours1: this.#activeHour1,
          minutes1: this.#activeMinute1,
          hours2: this.#activeHour2,
          minutes2: this.#activeMinute2
        });
      }

      return selectionKeys.join(',');
    }

    if (mapSelectionKeys) {
      return mapSelectionKeys({
        selectionKeys: [],
        hours1: this.#activeHour1,
        minutes1: this.#activeMinute1,
        hours2: this.#activeHour2,
        minutes2: this.#activeMinute2
      }).join(',');
    }

    return '';
  }

  setValue(value: string) {
    if (!value) {
      this.#selection.clear();
    } else {
      // TODO!!!!!!!
    }
  }

  resetView() {
    this.#view = selectionModeMeta[this.#selectionMode].initialView;
    this.#requestUpdate();
  }

  #onParentClick = () => {
    const idx = calendarViewOrder.indexOf(this.#view as CalendarView);

    const nextView =
      idx < 0 || idx === calendarViewOrder.length - 1
        ? null
        : calendarViewOrder[idx + 1];

    if (nextView) {
      this.#view = nextView as View;
      this.#requestUpdate();
    }
  };

  #onNextClick = () => {
    if (this.#sheet?.next) {
      this.#activeYear = this.#sheet.next.year;
      this.#activeMonth = this.#sheet.next.month ?? this.#activeMonth;
      this.#requestUpdate();
    }
  };

  #onPreviousClick = () => {
    if (this.#sheet?.previous) {
      this.#activeYear = this.#sheet.previous.year;
      this.#activeMonth = this.#sheet.previous.month ?? this.#activeMonth;
      this.#requestUpdate();
    }
  };

  #onItemClick = (ev: Event, props: DatePicker.Props, item: SheetItem) => {
    const getSelectionKey =
      selectionModeMeta[props.selectionMode].getSelectionKey;

    const selectionKey = getSelectionKey!({
      year: item.year,
      month: item.month,
      day: item.day,
      weekYear: item.weekYear,
      weekNumber: item.weekNumber
    });

    const selectType = selectionModeMeta[props.selectionMode].selectType;
    const initialView = selectionModeMeta[props.selectionMode].initialView;
    const selected = this.#selection.has(selectionKey);

    if (this.#view !== initialView) {
      const idx = calendarViewOrder.indexOf(this.#view as CalendarView);

      const nextView = idx < 1 ? null : calendarViewOrder[idx - 1];

      if (nextView) {
        this.#activeYear = item.year;

        if (item.month) {
          this.#activeMonth = item.month;
        }

        this.#view = nextView as View;
        this.#requestUpdate();
      }

      return;
    }

    if (selectType === 'single') {
      this.#selection.clear();

      if (!selected) {
        this.#selection.add(selectionKey);
      }
    } else if (selectType === 'multi') {
      if (selected) {
        this.#selection.delete(selectionKey);
      } else {
        this.#selection.add(selectionKey);
      }
    } else if (selected) {
      this.#selection.delete(selectionKey);
    } else if (this.#selection.size > 1) {
      this.#selection.clear();
      this.#selection.add(selectionKey);
    } else {
      this.#selection.add(selectionKey);
    }

    this.#requestUpdate();
    this.#onChange?.();
  };

  #onBackToMonthClick = () => {
    this.#view = 'month';
    this.#requestUpdate();
  };

  #renderDatePicker() {
    const props = this.#getProps();

    if (this.#selectionMode !== props.selectionMode) {
      if (this.#selection.size > 0) {
        this.#selection.clear();
        this.#onChange?.();
      }

      this.#view = selectionModeMeta[props.selectionMode].initialView;
      this.#activeHour1 = 0;
      this.#activeMinute1 = 0;
      this.#activeHour2 = 0;
      this.#activeMinute2;
    }

    this.#selectionMode = props.selectionMode;
    this.#sheet = null;

    if (this.#view === 'month') {
      this.#sheet = this.#calendar.getMonthSheet({
        year: this.#activeYear,
        month: this.#activeMonth,
        showWeekNumbers: props.showWeekNumbers,
        selectWeeks:
          props.selectionMode === 'week' || props.selectionMode === 'weeks',
        disableWeekends: props.disableWeekends,
        highlightCurrent: true,
        highlightWeekends: props.highlightWeekends,
        minDate: null, //new Date(2022, 11, 15),
        maxDate: null

        /*
        selectedRange: {
          start: { year: 2022, month: 11, day: 12 },
          end: { year: 2022, month: 11, day: 22 }
        }
        */
      });
    } else if (this.#view === 'year') {
      this.#sheet = this.#calendar.getYearSheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null,
        selectedRange: null
      });
    } else if (this.#view === 'decade') {
      this.#sheet = this.#calendar.getDecadeSheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null,
        selectedRange: null
      });
    } else if (this.#view === 'century') {
      this.#sheet = this.#calendar.getCenturySheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null
      });
    }

    return this.#view !== 'time1' && this.#view !== 'time2'
      ? this.#renderCalendarView(this.#sheet!, props)
      : this.#renderTimeView(props);
  }

  #renderCalendarView(sheet: Sheet, props: DatePicker.Props) {
    const kind = selectionModeMeta[props.selectionMode].kind;

    return div(
      {
        class: 'cal-base cal-view--calendar'
      },
      this.#renderSheetHeader(sheet, props),
      this.#renderSheet(sheet, props),
      kind === 'calendar' ? null : this.#renderTimeLinks()
    );
  }

  #renderTimeView(props: DatePicker.Props) {
    const { kind, selectType } = selectionModeMeta[props.selectionMode];

    return div(
      {
        class: 'cal-base cal-view--time'
      },
      this.#renderTimeTabs(this.#view === 'time2' ? 'time2' : 'time1', props),
      this.#renderTimeSliders(this.#view == 'time2' ? 'time2' : 'time1', props),

      kind !== 'calendar+time'
        ? null
        : a(
            {
              class: 'cal-back-to-month-link',
              onclick: this.#onBackToMonthClick
            },
            'Back to month'
          )
    );
  }

  #renderSheetHeader(sheet: Sheet, props: DatePicker.Props) {
    const parentViewDisabled =
      this.#view === 'century' ||
      (this.#view === 'decade' && !props.enableCenturyView);

    return div(
      {
        class: classMap({
          'cal-header': true,
          'cal-header--accentuated': props.accentuateHeader
        })
      },
      div(
        {
          class: classMap({
            'cal-prev': true,
            'cal-prev--disabled': !sheet.previous
          }),
          onclick: !sheet.previous ? null : this.#onPreviousClick
        },
        arrowLeftIcon
      ),
      div(
        {
          class: classMap({
            'cal-title': true,
            'cal-title--disabled': parentViewDisabled
          }),
          onclick: parentViewDisabled ? null : this.#onParentClick
        },
        sheet.name
      ),
      div(
        {
          class: classMap({
            'cal-next': true,
            'cal-next--disabled': !sheet.next
          }),
          onclick: !sheet.next ? null : this.#onNextClick
        },
        arrowRightIcon
      )
    );
  }

  #renderSheet(sheet: Sheet, props: DatePicker.Props) {
    const hasRowNames = !!sheet.rowNames?.length;

    let gridTemplateColumns =
      (hasRowNames ? 'min-content ' : '') + `repeat(${sheet.columnCount}, 1fr)`;

    return div(
      {
        class: 'cal-sheet',
        style: `grid-template-columns: ${gridTemplateColumns};`
      },
      sheet.columnNames?.length ? this.#renderTableHead(sheet, props) : null,
      this.#renderTableBody(sheet, props)
    );
  }

  #renderTableHead(sheet: Sheet, props: DatePicker.Props) {
    const hasRowNames = !!sheet.rowNames?.length;

    const headRow = sheet.columnNames!.map((it, idx) =>
      div(
        {
          class: classMap({
            'cal-column-name': true,
            'cal-column-name--highlighted':
              sheet.highlightedColumns?.includes(idx)
          })
        },
        it
      )
    );

    if (hasRowNames) {
      headRow.unshift(div());
    }

    return headRow;
  }

  #renderTableBody(sheet: Sheet, props: DatePicker.Props) {
    const hasRowNames = !!sheet.rowNames?.length;
    const cells: VNode[] = [];

    sheet.items.forEach((item, idx) => {
      if (hasRowNames && idx % 7 === 0) {
        cells.push(
          div({ class: 'cal-cell cal-row-name' }, sheet.rowNames![idx / 7])
        );
      }

      cells.push(this.#renderTableCell(item, props));
    });

    return cells;
  }

  #renderTableCell(item: SheetItem, props: DatePicker.Props) {
    const selectionKey =
      selectionModeMeta[props.selectionMode].getSelectionKey(item);

    const selected = this.#selection.has(selectionKey);

    return div(
      {
        class: classMap({
          'cal-cell-container': true,
          'cal-cell-container--highlighted': item.highlighted
        })
      },
      a(
        {
          class: classMap({
            'cal-cell': true,
            'cal-cell--current': !props.highlightCurrent ? null : item.current,
            'cal-cell--disabled': item.disabled,
            'cal-cell--adjacent': item.adjacent,
            'cal-cell--selected': selected,
            'cal-cell--in-selection-range': item.inSelectedRange,
            'cal-cell--first-in-selection-range': item.firstInSelectedRange,
            'cal-cell--last-in-selection-range': item.lastInSelectedRange
          }),

          onclick: item.disabled
            ? null
            : (ev: Event) => this.#onItemClick(ev, props, item)
        },
        item.name
      )
    );
  }

  // --- time links ------------------------------------------------

  #renderTimeLinks() {
    const selectionSize = this.#selection.size;

    return div(
      { class: 'cal-time-links' },
      this.#renderTimeLink('time1'),
      selectionSize > 1 ? this.#renderTimeLink('time2') : null
    );
  }

  #renderTimeLink(type: 'time1' | 'time2') {
    let hour = 0;
    let minute = 0;

    let timeString = '';

    if (this.#selection.size > 0) {
      if (type === 'time1') {
        hour = this.#activeHour1;
        minute = this.#activeMinute1;
      } else {
        hour = this.#activeHour2;
        minute = this.#activeMinute2;
      }

      const date = new Date(2000, 0, 1, hour, minute);

      timeString = this.#i18n.formatDate(date, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return a(
      {
        class: classMap({
          'cal-time-link': true,
          'cal-time-link--disabled': timeString === ''
        }),
        onclick: () => {
          this.#view = type;
          this.#requestUpdate();
        }
      },
      timeIcon,
      timeString === '' ? '--:--' : timeString
    );
  }

  // --- time --------------------------------------------------------

  #renderTime(type: 'time1' | 'time2', props: DatePicker.Props) {
    const { kind } = selectionModeMeta[props.selectionMode];
    const hour = type === 'time1' ? this.#activeHour1 : this.#activeHour2;
    const minute = type === 'time1' ? this.#activeMinute1 : this.#activeMinute2;
    const items = [...this.#selection].sort();

    const date = new Date(
      items.length === 0 ? 0 : type === 'time1' ? items[0] : items[1]
    );

    date.setHours(hour);
    date.setMinutes(minute);

    let time = this.#i18n.formatDate(date, {
      hour: '2-digit',
      minute: '2-digit'
    });

    let timeHeader: VNode = null;

    if (
      props.selectionMode === 'dateTime' ||
      props.selectionMode === 'dateTimeRange'
    ) {
      const formattedDate = this.#i18n.formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      let fromOrToLabel = '';

      if (props.selectionMode === 'dateTimeRange') {
        const selectionSize = this.#selection.size;

        if (selectionSize > 1) {
          fromOrToLabel = (type === 'time1' ? 'from:' : 'to:') + '\u00a0\u00a0';
        }
      }

      timeHeader = h(
        'div',
        { class: 'cal-time-header' },
        fromOrToLabel,
        formattedDate
      );
    } else if (props.selectionMode === 'timeRange') {
      timeHeader = h(
        'div',
        { class: 'cal-time-header' },
        (type === 'time1' ? 'from:' : 'to:') + '\u00a0\u00a0'
      );
    }

    return div(
      {
        class: `cal-time cal-time--${type === 'time1' ? '1' : '2'}`,
        onclick: () => {
          this.#view = type;
          this.#requestUpdate();
        }
      },
      timeHeader,
      div({ class: 'cal-time-value' }, time)
    );
  }

  // --- time tabs ---------------------------------------------------

  #renderTimeTabs(type: 'time1' | 'time2', props: DatePicker.Props) {
    const { kind, selectType } = selectionModeMeta[props.selectionMode];
    const showsTwoTabs = kind === 'time' || this.#selection.size > 1;

    return div(
      {
        class: classMap({
          'cal-time-tabs': true,
          [`cal-time-tabs--active-tab-${type}`]: showsTwoTabs
        })
      },
      this.#renderTime('time1', props),
      (kind === 'time' && selectType === 'range') || this.#selection.size > 1
        ? this.#renderTime('time2', props)
        : null
    );
  }

  // --- time sliders ------------------------------------------------

  #renderTimeSliders(type: 'time1' | 'time2', props: DatePicker.Props) {
    const selectionMode = props.selectionMode;

    let hour = 0;
    let minute = 0;

    if (type === 'time1') {
      hour = this.#activeHour1;
      minute = this.#activeMinute1;
    } else {
      hour = this.#activeHour2;
      minute = this.#activeMinute2;
    }

    return div(
      null,
      div(
        { class: 'cal-time-sliders' },
        div({ class: 'cal-time-slider-headline' }, 'Hours'),
        input({
          type: 'range',
          class: 'cal-time-slider',
          value: hour,
          min: 0,
          max: 23,
          oninput: (ev: Event) => {
            if (type === 'time1') {
              this.#activeHour1 = (ev.target as HTMLInputElement).valueAsNumber;
            } else {
              this.#activeHour2 = (ev.target as HTMLInputElement).valueAsNumber;
            }

            this.#requestUpdate();
            this.#onChange?.();
          }
        }),
        div({ class: 'cal-time-slider-headline' }, 'Minutes'),
        input({
          type: 'range',
          class: 'cal-time-slider',
          value: minute,
          min: 0,
          max: 59,
          oninput: (ev: Event) => {
            if (type === 'time1') {
              this.#activeMinute1 = (
                ev.target as HTMLInputElement
              ).valueAsNumber;
            } else {
              this.#activeMinute2 = (
                ev.target as HTMLInputElement
              ).valueAsNumber;
            }

            this.#requestUpdate();
            this.#onChange?.();
          }
        })
      )
    );
  }
}
