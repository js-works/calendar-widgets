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

// === local types ===================================================

type Time = Readonly<{ hours: number; minutes: number }>;

// === local VDOM factories ==========================================

const a = h.bind(null, 'a');
const div = h.bind(null, 'div');
const input = h.bind(null, 'input');
const span = h.bind(null, 'span');

// === exported classes ==============================================

class DatePicker {
  static styles = datePickerBaseStyles;

  #i18n: I18n;
  #getProps: () => DatePicker.Props;
  #requestUpdate: () => void;
  #onChange: () => void;

  #selection = new Set<string>();
  #year = new Date().getFullYear();
  #month = new Date().getMonth();
  #time1: Time = { hours: 0, minutes: 0 };
  #time2: Time = { hours: 0, minutes: 0 };

  #selectionMode: SelectionMode = 'date';
  #view: View = 'month';
  #sheet: Sheet | null = null;

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

  render(target: HTMLElement) {
    render(this.#renderDatePicker(), target);
  }

  renderToString(): string {
    return renderToString(this.#renderDatePicker());
  }

  getValue(): string {
    const items = [...this.#selection].sort();
    const { kind, selectType } = selectionModeMeta[this.#selectionMode];

    if (kind !== 'time' && items.length === 0) {
      return '';
    }

    if (kind === 'calendar') {
      return items.join(',');
    }

    if (kind === 'calendar+time') {
      const items2: string[] = [];

      items2.push(
        items[0] +
          'T' +
          getHourMinuteString(this.#time1.hours, this.#time1.minutes)
      );

      if (items.length > 1) {
        items2.push(
          items[1] +
            'T' +
            getHourMinuteString(this.#time2.hours, this.#time2.minutes)
        );
      }

      return items2.join(',');
    }

    if (selectType === 'single') {
      return getHourMinuteString(this.#time1.hours, this.#time1.minutes);
    }

    return (
      getHourMinuteString(this.#time1.hours, this.#time1.minutes) +
      ',' +
      getHourMinuteString(this.#time2.hours, this.#time2.minutes)
    );
  }

  setValue(value: string) {
    this.#selection.clear();

    if (value) {
      // TODO!!!!!!!!!!!!!!!!!!
      value.split(',').forEach((item) => {
        this.#selection.add(item);
      });
    }

    this.#requestUpdate();
  }

  resetView() {
    this.#view = selectionModeMeta[this.#selectionMode].initialView;
    this.#requestUpdate();
  }

  #getTime(type: 'time1' | 'time2') {
    return type === 'time1' ? this.#time1 : this.#time2;
  }

  #setTime(
    type: 'time1' | 'time2',
    hours: number | null,
    minutes: number | null
  ) {
    const oldTime = type === 'time1' ? this.#time1 : this.#time2;

    const newTime = {
      hours: hours ?? oldTime.hours,
      minutes: minutes ?? oldTime.minutes
    };

    if (type === 'time1') {
      this.#time1 = newTime;
    } else {
      this.#time2 = newTime;
    }
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
      this.#year = this.#sheet.next.year;
      this.#month = this.#sheet.next.month ?? this.#month;
      this.#requestUpdate();
    }
  };

  #onPreviousClick = () => {
    if (this.#sheet?.previous) {
      this.#year = this.#sheet.previous.year;
      this.#month = this.#sheet.previous.month ?? this.#month;
      this.#requestUpdate();
    }
  };

  #onItemClick = (ev: Event, props: DatePicker.Props, item: SheetItem) => {
    const selectionKey = getSelectionKey(item, this.#selectionMode);
    const selectType = selectionModeMeta[props.selectionMode].selectType;
    const initialView = selectionModeMeta[props.selectionMode].initialView;
    const selected = this.#selection.has(selectionKey);

    if (this.#view !== initialView) {
      const idx = calendarViewOrder.indexOf(this.#view as CalendarView);

      const nextView = idx < 1 ? null : calendarViewOrder[idx - 1];

      if (nextView) {
        this.#year = item.year;

        if (item.month) {
          this.#month = item.month;
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
    const calendar = new Calendar(this.#i18n.getLocale());

    if (this.#selectionMode !== props.selectionMode) {
      if (this.#selection.size > 0) {
        this.#selection.clear();
        this.#onChange?.();
      }

      this.#view = selectionModeMeta[props.selectionMode].initialView;
      this.#setTime('time1', 0, 0);
      this.#setTime('time2', 0, 0);
    }

    this.#selectionMode = props.selectionMode;
    this.#sheet = null;
    const { kind, selectType } = selectionModeMeta[props.selectionMode];
    const selectionSize = this.#selection.size;

    if (this.#view === 'month') {
      this.#sheet = calendar.getMonthSheet({
        year: this.#year,
        month: this.#month,
        showWeekNumbers: props.showWeekNumbers,

        selectWeeks:
          props.selectionMode === 'week' ||
          props.selectionMode === 'weeks' ||
          props.selectionMode === 'weekRange',

        calendarSize: props.calendarSize,
        disableWeekends: props.disableWeekends,
        highlightCurrent: true,
        highlightWeekends: props.highlightWeekends,
        minDate: props.minDate,
        maxDate: props.maxDate
      });
    } else if (this.#view === 'year') {
      this.#sheet = calendar.getYearSheet({
        year: this.#year,
        minDate: props.minDate,
        maxDate: props.maxDate,

        selectQuarters:
          props.selectionMode === 'quarter' ||
          props.selectionMode === 'quarters' ||
          props.selectionMode === 'quarterRange'
      });
    } else if (this.#view === 'decade') {
      this.#sheet = calendar.getDecadeSheet({
        year: this.#year,
        minDate: props.minDate,
        maxDate: props.maxDate
      });
    } else if (this.#view === 'century') {
      this.#sheet = calendar.getCenturySheet({
        year: this.#year,
        minDate: props.minDate,
        maxDate: props.maxDate
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
        class: 'cal-base cal-view--' + this.#view
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
        class: 'cal-base cal-view--' + this.#view
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

      cells.push(this.#renderTableCell(item, sheet, props, idx));
    });

    return cells;
  }

  #renderTableCell(
    item: SheetItem,
    sheet: Sheet,
    props: DatePicker.Props,
    columnIndex: number
  ) {
    if (props.calendarSize === 'minimal' && item.adjacent) {
      const highlighted = !!sheet.highlightedColumns?.includes(
        columnIndex % sheet.columnCount
      );

      return div({
        class: classMap({
          'cal-cell--highlighted': highlighted
        })
      });
    }

    const selectionKey = getSelectionKey(item, this.#selectionMode);
    const selected = this.#selection.has(selectionKey);
    const { selectType } = selectionModeMeta[this.#selectionMode];
    const hasSelectedRange = this.#selection.size > 0 && selectType === 'range';
    const selectedItems = [...this.#selection].sort();
    const startSelectionKey = selectedItems[0];
    const endSelectionKey =
      selectedItems.length < 2 ? selectedItems[0] : selectedItems[1];

    return a(
      {
        class: classMap({
          'cal-cell': true,
          'cal-cell--current': !props.highlightCurrent ? null : item.current,
          'cal-cell--disabled': item.disabled,
          'cal-cell--adjacent': item.adjacent,
          'cal-cell--highlighted': item.highlighted,
          'cal-cell--selected': selected,

          'cal-cell--in-selection-range':
            hasSelectedRange &&
            selectionKey >= startSelectionKey &&
            selectionKey <= endSelectionKey,

          'cal-cell--first-in-selection-range':
            hasSelectedRange &&
            selectionKey === startSelectionKey &&
            this.#selectionMode !== 'weekRange',

          'cal-cell--last-in-selection-range':
            hasSelectedRange &&
            selectionKey === endSelectionKey &&
            this.#selectionMode !== 'weekRange',

          'cal-cell--before-singleton-selection-range':
            hasSelectedRange &&
            selectedItems.length === 1 &&
            selectionKey < startSelectionKey,

          'cal-cell--after-singleton-selection-range':
            hasSelectedRange &&
            selectedItems.length === 1 &&
            selectionKey > endSelectionKey
        }),

        onclick: item.disabled
          ? null
          : (ev: Event) => this.#onItemClick(ev, props, item)
      },
      span(null, item.name)
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
    let timeString = '';

    if (this.#selection.size > 0) {
      const { hours, minutes } = this.#getTime(type);
      const date = new Date(2000, 0, 1, hours, minutes);

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
    const { kind, selectType } = selectionModeMeta[this.#selectionMode];
    const time = this.#getTime(type);
    const items = [...this.#selection].sort();
    const fallbackDate = new Date(1970, 0, 1);

    const date =
      type === 'time1' && items.length > 0
        ? new Date(items[0])
        : type === 'time2' && items.length > 1
        ? new Date(items[1])
        : fallbackDate;

    date.setHours(time.hours);
    date.setMinutes(time.minutes);

    let formattedTime = this.#i18n.formatDate(date, {
      hour: '2-digit',
      minute: '2-digit'
    });

    let timeHeader: VNode = null;

    if (date !== fallbackDate) {
      const formattedDate = this.#i18n.formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const fromOrToLabel =
        selectType === 'range' && this.#selection.size > 1
          ? (type === 'time1' ? 'from:' : 'to:') + '\u00a0\u00a0'
          : '';

      timeHeader = div(
        { class: 'cal-time-header' },
        fromOrToLabel,
        formattedDate
      );
    } else if (
      this.#selection.size > 1 ||
      (kind === 'time' && selectType === 'range')
    ) {
      timeHeader = div(
        { class: 'cal-time-header' },
        (type === 'time1' ? 'from:' : 'to:') + '\u00a0\u00a0'
      );
    }

    return div(
      {
        class: 'cal-time',
        onclick: () => {
          this.#view = type;
          this.#requestUpdate();
        }
      },
      timeHeader,
      div({ class: 'cal-time-value' }, formattedTime)
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
    const time = this.#getTime(type);

    return div(
      null,
      div(
        { class: 'cal-time-sliders' },
        div({ class: 'cal-time-slider-headline' }, 'Hours'),
        input({
          type: 'range',
          class: 'cal-time-slider',
          value: time.hours,
          min: 0,
          max: 23,
          oninput: (ev: Event) => {
            const hours = (ev.target as HTMLInputElement).valueAsNumber;
            this.#setTime(type, hours, null);
            this.#requestUpdate();
            this.#onChange?.();
          }
        }),
        div({ class: 'cal-time-slider-headline' }, 'Minutes'),
        input({
          type: 'range',
          class: 'cal-time-slider',
          value: time.minutes,
          min: 0,
          max: 59,
          oninput: (ev: Event) => {
            const minutes = (ev.target as HTMLInputElement).valueAsNumber;
            this.#setTime(type, null, minutes);
            this.#requestUpdate();
            this.#onChange?.();
          }
        })
      )
    );
  }
}

// === local helpers =================================================

function getSelectionKey(
  items: SheetItem,
  selectionMode: DatePicker.SelectionMode
) {
  let ret;

  if (typeof items.weekNumber !== 'number') {
    ret = String(items.year).padStart(4, '0');

    // TODO!!!
    if (
      selectionMode !== 'quarter' &&
      selectionMode !== 'quarters' &&
      selectionMode !== 'quarterRange'
    ) {
      if (typeof items.month === 'number') {
        ret += '-' + String(items.month + 1).padStart(2, '0');
      }

      if (typeof items.day === 'number') {
        ret += '-' + String(items.day).padStart(2, '0');
      }
    } else {
      ret += '-Q' + String(Math.floor(items.month! / 3) + 1);
    }
  } else {
    ret =
      String(items.weekYear).padStart(4, '0') +
      '-W' +
      String(items.weekNumber).padStart(2, '0');
  }

  return ret;
}

function getHourMinuteString(hour: number, minute: number) {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');

  return `${h}:${m}`;
}
