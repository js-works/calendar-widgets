import { Calendar, Sheet, SheetItem } from './calendar';
import { h, render, renderToString, VNode } from './vdom';
import {
  classMap,
  getYearString,
  getYearMonthDayString,
  getYearMonthString,
  getYearWeekString
} from './utils';
import { I18n } from './i18n';
import { getHourMinuteString } from './utils';

// icons
import arrowLeftIcon from './icons/arrow-left.icon';
import arrowRightIcon from './icons/arrow-right.icon';
import timeIcon from './icons/time.icon';

// styles
import datePickerBaseStyles from './date-picker.styles';

export { DatePicker };

// === types =========================================================

namespace DatePicker {
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

const [a, div, input] = ['a', 'div', 'input'].map((tag) => h.bind(null, tag));

class DatePicker {
  static styles = datePickerBaseStyles;

  #i18n: I18n;
  #getProps: () => DatePicker.Props;
  #requestUpdate: () => void;
  #onChange: () => void;

  #selection = new Set<string>();
  #activeYear = 2022;
  #activeMonth = 11;
  #activeHour1 = 0;
  #activeHour2 = 0;
  #activeMinute1 = 0;
  #activeMinute2 = 0;
  #view: View = 'month';
  #sheet: Sheet | null = null;
  #oldSelectionMode: DatePicker.SelectionMode = 'date';

  constructor(params: {
    getLocale: () => string;
    getDirection: () => string;
    getProps: () => DatePicker.Props; //
    requestUpdate: () => void;
    onChange: () => void;
  }) {
    this.#i18n = new I18n(params.getLocale);
    this.#getProps = params.getProps;
    this.#requestUpdate = params.requestUpdate;
    this.#onChange = params.onChange;
  }

  getValue() {
    const { kind, mapSelectionKeys } =
      selectionModeMeta[this.#oldSelectionMode];

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

      const x = selectionKeys.join(',');

      return x;
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
    // TODO!!!!!
  }

  #sheetHasRowNames(sheet: Sheet) {
    return !!sheet.rowNames?.length;
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
    const selectionKey = selectionModeMeta[props.selectionMode]
      .getSelectionKey!({
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

  #onHour1Change = (ev: Event) => {
    this.#activeHour1 = (ev.target as HTMLInputElement).valueAsNumber;
    this.#requestUpdate();
    this.#onChange?.();
  };

  #onHour2Change = (ev: Event) => {
    this.#activeHour2 = (ev.target as HTMLInputElement).valueAsNumber;
    this.#requestUpdate();
    this.#onChange?.();
  };

  #onMinute1Change = (ev: Event) => {
    this.#activeMinute1 = (ev.target as HTMLInputElement).valueAsNumber;
    this.#requestUpdate();
    this.#onChange?.();
  };

  #onMinute2Change = (ev: Event) => {
    this.#activeMinute2 = (ev.target as HTMLInputElement).valueAsNumber;
    this.#requestUpdate();
    this.#onChange?.();
  };

  #onBackToMonthClick = () => {
    this.#view = 'month';
    this.#requestUpdate();
  };

  render(target: HTMLElement) {
    render(this.#getVNode(), target);
  }

  renderToString() {
    return renderToString(this.#getVNode());
  }

  #getVNode() {
    const props = this.#getProps();

    if (this.#oldSelectionMode !== props.selectionMode) {
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

    this.#oldSelectionMode = props.selectionMode;
    this.#sheet = null;

    const calendar = new Calendar(this.#i18n.getLocale());

    if (this.#view === 'month') {
      this.#sheet = calendar.getMonthSheet({
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
      this.#sheet = calendar.getYearSheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null,
        selectedRange: null
      });
    } else if (this.#view === 'decade') {
      this.#sheet = calendar.getDecadeSheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null,
        selectedRange: null
      });
    } else if (this.#view === 'century') {
      this.#sheet = calendar.getCenturySheet({
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
        class: 'class-base cal-view--time'
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
    const hasRowNames = this.#sheetHasRowNames(sheet);

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

    if (this.#sheetHasRowNames(sheet)) {
      headRow.unshift(div());
    }

    return headRow;
  }

  #renderTableBody(sheet: Sheet, props: DatePicker.Props) {
    const cells: VNode[] = [];

    sheet.items.forEach((item, idx) => {
      if (this.#sheetHasRowNames(sheet) && idx % 7 === 0) {
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
    const hour = type === 'time1' ? this.#activeHour1 : this.#activeHour2;

    const minute = type === 'time1' ? this.#activeMinute1 : this.#activeHour2;

    const timeDate = new Date(1970, 0, 1, hour, minute);

    let time = this.#i18n.formatDate(timeDate, {
      hour: '2-digit',
      minute: '2-digit'
    });

    let timeHeader: VNode = null;

    if (
      props.selectionMode === 'dateTime' ||
      props.selectionMode === 'dateTimeRange'
    ) {
      const date = new Date(); // TODO!!!!!!!!

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
        'class': `cal-time cal-time--${type === 'time1' ? '1' : '2'}`,
        'data-subject': `timeRange${type === 'time1' ? '1' : '2'}`
      },
      timeHeader,
      div({ class: 'cal-time-value' }, time)
    );
  }

  // --- time tabs ---------------------------------------------------

  #renderTimeTabs(type: 'time1' | 'time2', props: DatePicker.Props) {
    const { kind, selectType } = selectionModeMeta[props.selectionMode];

    const showsTwoTabs = this.#selection.size > 1;

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
        div(
          null,
          div({ class: 'cal-time-slider-headline' }, 'Hours'),
          input({
            type: 'range',
            class: 'cal-time-slider',
            value: hour,
            min: 0,
            max: 23,
            oninput:
              type === 'time1' ? this.#onHour1Change : this.#onHour2Change
          })
        ),
        div(
          null,
          div({ class: 'cal-time-slider-headline' }, 'Minutes'),
          input({
            type: 'range',
            class: 'cal-time-slider',
            value: minute,
            min: 0,
            max: 59,
            oninput:
              type === 'time1' ? this.#onMinute1Change : this.#onMinute2Change
          })
        )
      )
    );
  }
}

type CalendarView = 'month' | 'year' | 'decade' | 'century';
type TimeView = 'time1' | 'time2';
type View = CalendarView | TimeView;

const calendarViewOrder: CalendarView[] = [
  'month',
  'year',
  'decade',
  'century'
];

const selectionModeMeta: Record<
  DatePicker.SelectionMode,
  {
    selectType: 'single' | 'multi' | 'range' | null;
    initialView: Exclude<View, 'time2'>;

    getSelectionKey: (params: {
      year?: number | undefined;
      month?: number | undefined;
      day?: number | undefined;
      weekYear?: number | undefined;
      weekNumber?: number | undefined;
    }) => string;

    mapSelectionKeys?: (params: {
      selectionKeys: string[];
      hours1: number;
      minutes1: number;
      hours2: number;
      minutes2: number;
    }) => string[];

    kind: 'calendar' | 'time' | 'calendar+time';
  }
> = {
  date: {
    selectType: 'single',
    initialView: 'month',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearMonthDayString(params.year!, params.month!, params.day!)
  },

  dates: {
    selectType: 'multi',
    initialView: 'month',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearMonthDayString(params.year!, params.month!, params.day!)
  },

  dateRange: {
    selectType: 'range',
    initialView: 'month',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearMonthDayString(params.year!, params.month!, params.day!)
  },

  dateTime: {
    selectType: 'single',
    initialView: 'month',
    kind: 'calendar+time',

    getSelectionKey: (params) =>
      getYearMonthDayString(params.year!, params.month!, params.day!),

    mapSelectionKeys: (params) => [
      params.selectionKeys[0] +
        'T' +
        getHourMinuteString(params.hours1, params.minutes1)
    ]
  },

  dateTimeRange: {
    selectType: 'range',
    initialView: 'month',
    kind: 'calendar+time',

    getSelectionKey: (params) =>
      getYearMonthDayString(params.year!, params.month!, params.day!),

    mapSelectionKeys: (params) => {
      let ret = [
        params.selectionKeys[0] +
          'T' +
          getHourMinuteString(params.hours1, params.minutes1)
      ];

      if (params.selectionKeys.length > 1) {
        ret.push(
          params.selectionKeys[1] +
            'T' +
            getHourMinuteString(params.hours2, params.minutes2)
        );
      }

      return ret;
    }
  },

  time: {
    selectType: 'single',
    initialView: 'time1',
    kind: 'time',
    getSelectionKey: () => 'TODO!!!',

    mapSelectionKeys: (params) => [
      getHourMinuteString(params.hours1, params.minutes1)
    ]
  },

  timeRange: {
    selectType: 'range',
    initialView: 'time1',
    kind: 'time',
    getSelectionKey: () => 'TODO!!!'
  },

  week: {
    selectType: 'single',
    initialView: 'month',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearWeekString(params.weekYear!, params.weekNumber!)
  },

  weeks: {
    selectType: 'multi',
    initialView: 'month',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearWeekString(params.weekYear!, params.weekNumber!)
  },

  month: {
    selectType: 'single',
    initialView: 'year',
    kind: 'calendar',

    getSelectionKey: (params) => getYearMonthString(params.year!, params.month!)
  },

  months: {
    selectType: 'multi',
    initialView: 'year',
    kind: 'calendar',

    getSelectionKey: (params) => getYearMonthString(params.year!, params.month!)
  },

  monthRange: {
    selectType: 'range',
    initialView: 'year',
    kind: 'calendar',

    getSelectionKey: (params) => getYearMonthString(params.year!, params.month!)
  },

  year: {
    selectType: 'single',
    initialView: 'decade',
    kind: 'calendar',

    getSelectionKey: (params) => getYearString(params.year!)
  },

  years: {
    selectType: 'multi',
    initialView: 'decade',
    kind: 'calendar',

    getSelectionKey: (params) => getYearString(params.year!)
  },

  yearRange: {
    selectType: 'range',
    initialView: 'decade',
    kind: 'calendar',

    getSelectionKey: (params) => getYearString(params.year!)
  }
};
