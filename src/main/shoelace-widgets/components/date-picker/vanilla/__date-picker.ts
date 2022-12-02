import { Calendar, Sheet, SheetItem } from './__calendar';
import { h, renderToString, VNode } from './vdom';
import { classMap } from './__utils';
import { I18n } from './__i18n';

// icons
import arrowLeftIcon from './icons/arrow-left.icon';
import arrowRightIcon from './icons/arrow-right.icon';
import timeIcon from './icons/time.icon';

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
    sheetSize: 'default' | 'minimal' | 'maximal';
    highlightToday: boolean;
    highlightWeekends: boolean;
    disableWeekends: boolean;
    enableCenturyView: boolean;
    minDate: Date | null;
    maxDate: Date | null;
  };
}

const [a, div, input] = ['a', 'div', 'input'].map((tag) => h.bind(null, tag));

class DatePicker {
  #i18n: I18n;
  #getProps: () => DatePicker.Props;
  #requestUpdate: () => void;

  #selection = new Set<string>();
  #activeYear = 2022;
  #activeMonth = 11;
  #activeDay = 1;
  #activeHour1 = 0;
  #activeHour2 = 0;
  #activeMinute1 = 0;
  #activeMinute2 = 0;
  #view: View = 'century';

  constructor(
    host: HTMLElement | Promise<HTMLElement>,
    params: {
      getLocale: () => string;
      getProps: () => DatePicker.Props; //
      requestUpdate: () => void;
    }
  ) {
    this.#i18n = new I18n(params.getLocale);
    this.#getProps = params.getProps;
    this.#requestUpdate = params.requestUpdate;

    (host instanceof HTMLElement ? Promise.resolve(host) : host).then(
      (elem) => {
        const root = elem.shadowRoot || elem;

        root.addEventListener('click', (ev: Event) => {
          const target = ev.target;
          const result = this.#getSubject(target);

          if (!result) {
            return;
          }

          const [subject, elem] = result;
          const props = this.#getProps();

          switch (subject) {
            case 'next':
              return this.#onNextClick();

            case 'prev':
              return this.#onPrevClick();

            case 'item':
              return this.#onItemClick(elem, props);
          }
        });
      }
    );
  }

  #getSubject(target: EventTarget | null): [string, HTMLElement] | null {
    if (target && target instanceof Element) {
      const elem = target.closest('[data-subject]');

      if (elem instanceof HTMLElement) {
        const subject = elem?.getAttribute('data-subject');

        if (subject) {
          return [subject, elem];
        }
      }
    }

    return null;
  }

  #sheetHasRowNames(sheet: Sheet) {
    return !!sheet.rowNames?.length;
  }

  #onNextClick = () => {
    if (this.#view === 'month') {
      if (this.#activeMonth === 11) {
        ++this.#activeYear;
        this.#activeMonth = 0;
      } else {
        ++this.#activeMonth;
      }
    } else if (this.#view === 'year') {
      ++this.#activeYear;
    } else if (this.#view === 'decade') {
      this.#activeYear = Math.floor(((this.#activeYear + 10) / 10) * 10);
    } else if (this.#view === 'century') {
      this.#activeYear = Math.floor(((this.#activeYear + 100) / 100) * 100);
    }

    this.#requestUpdate();
  };

  #onPrevClick = () => {
    if (this.#view === 'month') {
      if (this.#activeMonth === 0) {
        --this.#activeYear;
        this.#activeMonth = 11;
      } else {
        --this.#activeMonth;
      }
    } else if (this.#view === 'year') {
      --this.#activeYear;
    } else if (this.#view === 'decade') {
      this.#activeYear = Math.floor(((this.#activeYear - 10) / 10) * 10);
    } else if (this.#view === 'century') {
      this.#activeYear = Math.floor(((this.#activeYear - 100) / 100) * 100);
    }

    this.#requestUpdate();
  };

  #onItemClick = (elem: HTMLElement, props: DatePicker.Props) => {
    const selectionKey = elem.getAttribute('data-selection-key');

    if (!selectionKey) {
      return;
    }

    const selectType = meta[props.selectionMode].selectType;
    const initialView = meta[props.selectionMode].initialView;
    const selected = this.#selection.has(selectionKey);

    if (this.#view !== initialView) {
      alert('TODO');
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
  };

  renderToString() {
    const props = this.#getProps();
    const cal = new Calendar('de-DE'); //this.#i18n.getLocale());

    let sheet: Sheet;

    if (this.#view === 'month') {
      sheet = cal.getMonthSheet({
        year: this.#activeYear,
        month: this.#activeMonth,
        showWeekNumbers: props.showWeekNumbers,
        selectWeeks: true,
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
      sheet = cal.getYearSheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null,
        selectedRange: null
      });
    } else if (this.#view === 'decade') {
      sheet = cal.getDecadeSheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null,
        selectedRange: null
      });
    } else if (this.#view === 'century') {
      sheet = cal.getCenturySheet({
        year: this.#activeYear,
        minDate: null,
        maxDate: null
      });
    }

    return renderToString(
      this.#renderCalendarView(sheet!, props)
      // this.#renderTimeView(props)
    );
  }

  #renderCalendarView(sheet: Sheet, props: DatePicker.Props) {
    return div(
      {
        class: 'cal-base cal-view--calendar'
      },
      this.#renderSheetHeader(sheet, props),
      this.#renderSheet(sheet, props),
      this.#renderTimeLinks()
    );
  }

  #renderTimeView(props: DatePicker.Props) {
    return div(
      {
        class: 'class-base cal-view--time'
      },
      this.#renderTimeTabs('time1', props),
      this.#renderTimeSliders('time1', props),

      props.selectionMode !== 'dateTime' &&
        props.selectionMode !== 'dateTimeRange'
        ? null
        : a(
            { 'class': 'cal-back-to-month-link', 'data-subject': 'view-month' },
            'Back to month'
          )
    );
  }

  #renderSheetHeader(sheet: Sheet, props: DatePicker.Props) {
    return div(
      {
        class: classMap({
          'cal-header': true,
          'cal-header--accentuated': props.accentuateHeader
        })
      },
      div(
        {
          'class': classMap({
            'cal-prev': true,
            'cal-prev--disabled': sheet.prevDisabled
          }),
          'data-subject': sheet.prevDisabled ? null : 'prev'
        },
        arrowLeftIcon
      ),
      div(
        {
          'class': classMap({
            'cal-title': true,
            'cal-title--disabled': false
          }),
          'data-subject': 'up'
        },
        sheet.name
      ),
      div(
        {
          'class': classMap({
            'cal-next': true,
            'cal-next--disabled': sheet.nextDisabled
          }),
          'data-subject': sheet.nextDisabled ? null : 'next'
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
    const selected = this.#selection.has(item.selectionKey);

    return div(
      {
        class: classMap({
          'cal-cell-container': true,
          'cal-cell-container--highlighted': item.highlighted
        })
      },
      a(
        {
          'class': classMap({
            'cal-cell': true,
            'cal-cell--current': item.current,
            'cal-cell--disabled': item.disabled,
            'cal-cell--adjacent': item.adjacent,
            'cal-cell--selected': selected,
            'cal-cell--in-selection-range': item.inSelectedRange,
            'cal-cell--first-in-selection-range': item.firstInSelectedRange,
            'cal-cell--last-in-selection-range': item.lastInSelectedRange
          }),

          'data-key': item.key,
          'data-selection-key': item.selectionKey,
          'data-subject': item.disabled ? null : 'item'
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
        'class': classMap({
          'cal-time-link': true,
          'cal-time-link--disabled': timeString === ''
        }),
        'data-subject': type
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
    const showsTwoTabs = this.#selection.size > 1;

    return div(
      {
        class: classMap({
          'cal-time-tabs': true,
          [`cal-time-tabs--active-tab-${type}`]: showsTwoTabs
        })
      },
      this.#renderTime('time1', props),
      this.#selection.size > 1 ? this.#renderTime('time2', props) : null
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
            'type': 'range',
            'class': 'cal-time-slider',
            'value': hour,
            'min': 0,
            'max': 23,
            'data-subject': 'hours' + (type === 'time2' ? '2' : '')
          })
        ),
        div(
          null,
          div({ class: 'cal-time-slider-headline' }, 'Minutes'),
          input({
            'type': 'range',
            'class': 'cal-time-slider',
            'value': minute,
            'min': 0,
            'max': 59,
            'data-subject': 'minutes' + (type === 'time2' ? '2' : '')
          })
        )
      )
    );
  }

  // --- back link----------------------------------------------------

  #renderBackToMonthLink() {
    return a(
      {
        class: 'cal-back-to-month-link'
      },
      'Back to month'
    );
  }
}

type View = 'month' | 'year' | 'decade' | 'century' | 'time1' | 'time2';

const meta: Record<
  DatePicker.SelectionMode,
  {
    selectType: 'single' | 'multi' | 'range' | null;
    initialView: Exclude<View, 'time2'>;
  }
> = {
  date: {
    selectType: 'single',
    initialView: 'month'
  },

  dates: {
    selectType: 'multi',
    initialView: 'month'
  },

  dateRange: {
    selectType: 'range',
    initialView: 'month'
  },

  dateTime: {
    selectType: 'single',
    initialView: 'month'
  },

  dateTimeRange: {
    selectType: 'range',
    initialView: 'month'
  },

  time: {
    selectType: null,
    initialView: 'time1'
  },

  timeRange: {
    selectType: null,
    initialView: 'time1'
  },

  week: {
    selectType: 'single',
    initialView: 'month'
  },

  weeks: {
    selectType: 'multi',
    initialView: 'month'
  },

  month: {
    selectType: 'single',
    initialView: 'year'
  },

  months: {
    selectType: 'multi',
    initialView: 'year'
  },

  monthRange: {
    selectType: 'range',
    initialView: 'year'
  },

  year: {
    selectType: 'single',
    initialView: 'decade'
  },

  years: {
    selectType: 'multi',
    initialView: 'decade'
  },

  yearRange: {
    selectType: 'range',
    initialView: 'decade'
  }
};
