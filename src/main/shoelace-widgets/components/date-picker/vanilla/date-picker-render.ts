import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';
import { CalendarLocalizer } from './calendar-localizer';
import { h, VElement, VNode } from './vdom';

// icons
import timeIcon from './icons/time.icon';
import arrowLeftIcon from './icons/arrow-left.icon';
import arrowRightIcon from './icons/arrow-right.icon';

const [a, div, img, input, span] = ['a', 'div', 'img', 'input', 'span'].map(
  (tag) => h.bind(null, tag)
);

function classMap(classes: Record<string, unknown>): string {
  const arr: string[] = [];

  for (const key of Object.keys(classes)) {
    if (classes[key]) {
      arr.push(key);
    }
  }

  return arr.join(' ');
}

import {
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearWeekString
} from './calendar-utils';
import { datePicker } from 'src/stories/date-picker.demo';

// === exports =======================================================

export { renderDatePicker, DatePickerProps };

// === types ===================================================

type DatePickerProps = {
  selectionMode: DatePickerController.SelectionMode;
  accentuateHeader: boolean;
  showWeekNumbers: boolean;
  daysAmount: 'default' | 'minimal' | 'maximal';
  highlightToday: boolean;
  highlightWeekends: boolean;
  disableWeekends: boolean;
  enableCenturyView: boolean;
  minDate: Date | null;
  maxDate: Date | null;
};

// === Calendar ======================================================

function renderDatePicker(
  locale: string,
  direction: 'ltr' | 'rtl',
  props: DatePickerProps,
  datePickerCtrl: DatePickerController
): VElement {
  const i18n = new CalendarLocalizer({
    locale,
    direction
  });

  const calendar = new Calendar({
    firstDayOfWeek: i18n.getFirstDayOfWeek(),
    weekendDays: i18n.getWeekendDays(),
    getCalendarWeek: (date: Date) => i18n.getCalendarWeek(date),
    disableWeekends: props.disableWeekends,
    alwaysShow42Days: props.daysAmount === 'maximal',
    minDate: props.minDate,
    maxDate: props.maxDate
  });

  function render() {
    const view = datePickerCtrl.getView();

    let sheet: VNode = null;
    let prevDisabled = false;
    let nextDisabled = false;

    switch (view) {
      case 'century': {
        const data = calendar.getCenturyData({
          year: datePickerCtrl.getActiveYear()
        });

        sheet = renderCenturySheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'decade': {
        let selectionRange: {
          start: { year: number };
          end: { year: number };
        } | null = null;

        const value = datePickerCtrl.getValue();

        const values = value
          ? value
              .split('|')
              .sort()
              .map((it) => parseInt(it, 10))
          : null;

        if (props.selectionMode === 'yearRange' && values) {
          selectionRange = {
            start: { year: values[0] },
            end: { year: values[1] }
          };
        }

        const data = calendar.getDecadeData({
          year: datePickerCtrl.getActiveYear(),
          selectionRange
        });

        sheet = renderDecadeSheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'year': {
        let selectionRange: {
          start: { year: number; month: number };
          end: { year: number; month: number };
        } | null = null;

        const value = datePickerCtrl.getValue();
        const values = value ? value.split('|').sort() : null;

        if (props.selectionMode === 'monthRange' && values) {
          const startTokens = values[0]
            .split('-')
            .map((it) => parseInt(it, 10));

          const endTokens = (values[1] || values[0])
            .split('-')
            .map((it) => parseInt(it, 10));

          selectionRange = {
            start: { year: startTokens[0], month: startTokens[1] - 1 },
            end: { year: endTokens[0], month: endTokens[1] - 1 }
          };
        }

        const data = calendar.getYearData({
          year: datePickerCtrl.getActiveYear(),
          selectionRange
        });
        console.log(selectionRange);
        sheet = renderYearSheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'month': {
        let selectionRange: {
          start: { year: number; month: number; day: number };
          end: { year: number; month: number; day: number };
        } | null = null;

        const value = datePickerCtrl.getValue();
        const values = value ? value.split('|').sort() : null;

        if (
          (props.selectionMode === 'dateRange' ||
            props.selectionMode === 'dateTimeRange') &&
          values
        ) {
          const startTokens = values[0]
            .split('-')
            .map((it) => parseInt(it, 10));

          const endTokens = (values[1] || values[0])
            .split('-')
            .map((it) => parseInt(it, 10));

          selectionRange = {
            start: {
              year: startTokens[0],
              month: startTokens[1] - 1,
              day: startTokens[2]
            },

            end: {
              year: endTokens[0],
              month: endTokens[1] - 1,
              day: endTokens[2]
            }
          };
        }

        const data = calendar.getMonthData({
          year: datePickerCtrl.getActiveYear(),
          month: datePickerCtrl.getActiveMonth(),
          selectionRange
        });

        sheet = renderMonthSheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'time':
      case 'time2':
      case 'timeRange':
        break;

      default:
        throw new Error(`Illegal view ${view}`);
    }

    // TODO!!!
    const typeSnakeCase = props.selectionMode.replace(
      /[A-Z]/g,
      (it) => `-${it.toLowerCase()}`
    );

    return div(
      { class: `cal-base cal-base--${typeSnakeCase}` },
      view === 'time' ||
        view === 'time2' ||
        props.selectionMode === 'time' ||
        props.selectionMode === 'timeRange'
        ? null
        : div(
            {
              class: classMap({
                'cal-nav': true,
                'cal-nav--accentuated': props.accentuateHeader
              })
            },
            a(
              {
                'class': classMap({
                  'cal-prev': true,
                  'cal-prev--disabled': prevDisabled
                }),
                'data-subject': prevDisabled ? null : 'prev'
              },
              i18n.getDirection() === 'ltr' ? arrowLeftIcon : arrowRightIcon
            ),
            renderTitle(),
            a(
              {
                'class': classMap({
                  'cal-next': true,
                  'cal-next--disabled': nextDisabled
                }),
                'data-subject': nextDisabled ? null : 'next'
              },
              i18n.getDirection() === 'ltr' ? arrowRightIcon : arrowLeftIcon
            )
          ),

      props.selectionMode === 'time' || props.selectionMode === 'timeRange'
        ? null
        : sheet,

      view === 'month' &&
        (props.selectionMode === 'dateTime' ||
          props.selectionMode === 'dateTimeRange')
        ? renderTimeLinks()
        : null,

      view !== 'time' ? null : renderTimeSelector('time'),
      view !== 'time2' ? null : renderTimeSelector('time2')
    );
  }

  function renderTitle() {
    const view = datePickerCtrl.getView();
    const activeYear = datePickerCtrl.getActiveYear();

    const title =
      view === 'century'
        ? i18n.getCenturyTitle(activeYear, 12)
        : view === 'decade'
        ? i18n.getDecadeTitle(activeYear, 12)
        : view === 'year'
        ? i18n.getYearTitle(activeYear)
        : i18n.getMonthTitle(activeYear, datePickerCtrl.getActiveMonth());

    const disabled =
      datePickerCtrl.getView() === 'century' ||
      (datePickerCtrl.getView() === 'decade' && !props.enableCenturyView);

    return div(
      {
        'class': classMap({
          'cal-title': true,
          'cal-title--disabled': disabled
        }),
        'data-subject': disabled ? null : 'title'
      },
      title
    );
  }

  function renderMonthSheet(monthData: Calendar.MonthData) {
    return div(
      {
        class: classMap({
          'cal-sheet': true,
          'cal-sheet--month': true,
          'cal-sheet--month-with-week-numbers': props.showWeekNumbers
        })
      },

      props.showWeekNumbers ? div() : null,

      monthData.weekdays.map((idx) =>
        div({ class: 'cal-weekday' }, i18n.getWeekdayName(idx, 'short'))
      ),

      monthData.days.flatMap((dayData, idx) => {
        const cell = renderDayCell(dayData);
        return !props.showWeekNumbers || idx % 7 > 0
          ? cell
          : [
              div(
                { class: 'cal-week-number' },
                i18n.formatWeekNumber(dayData.calendarWeek.week)
              ),
              cell
            ];
      })
    );
  }

  function renderDayCell(dayItem: Calendar.DayItem) {
    const currentHighlighted = props.highlightToday && dayItem.current;
    const highlighted = props.highlightWeekends && dayItem.weekend;

    if (props.daysAmount === 'minimal' && dayItem.adjacent) {
      return div({
        class: classMap({
          'cal-cell--highlighted': highlighted
        })
      });
    }

    const weekString = getYearWeekString(
      dayItem.calendarWeek.year,
      dayItem.calendarWeek.week
    );

    const selected =
      datePickerCtrl.hasSelectedDay(
        dayItem.year,
        dayItem.month,
        dayItem.day,
        weekString
      ) && !dayItem.disabled;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': dayItem.disabled,
          'cal-cell--adjacent': dayItem.adjacent,
          'cal-cell--current': dayItem.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--highlighted': highlighted,
          'cal-cell--selected': selected,
          'cal-cell--in-selection-range': dayItem.inSelectionRange,
          'cal-cell--first-in-selection-range': dayItem.firstInSelectionRange,
          'cal-cell--last-in-selection-range': dayItem.lastInSelectionRange
        }),
        'data-date': getYearMonthDayString(
          dayItem.year,
          dayItem.month,
          dayItem.day
        ),
        'data-week': weekString,
        'data-subject': dayItem.disabled ? null : 'day'
      },
      i18n.formatDay(dayItem.day)
    );
  }

  function renderYearSheet(yearData: Calendar.YearData) {
    return div(
      { class: 'cal-sheet cal-sheet--year' },
      yearData.months.map((monthData) => renderMonthCell(monthData))
    );
  }

  function renderMonthCell(monthItem: Calendar.MonthItem) {
    const selected = datePickerCtrl.hasSelectedMonth(
      monthItem.year,
      monthItem.month
    );

    const currentHighlighted = monthItem.current && props.highlightToday;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthItem.disabled,
          'cal-cell--current': monthItem.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected,
          'cal-cell--in-selection-range': monthItem.inSelectionRange,
          'cal-cell--first-in-selection-range': monthItem.firstInSelectionRange,
          'cal-cell--last-in-selection-range': monthItem.lastInSelectionRange
        }),
        'data-month': getYearMonthString(monthItem.year, monthItem.month),
        'data-subject': monthItem.disabled ? null : 'month'
      },
      i18n.getMonthName(monthItem.month, 'short')
    );
  }

  function renderDecadeSheet(decadeData: Calendar.DecadeData) {
    return div(
      { class: 'cal-sheet cal-sheet--decade' },
      decadeData.years.map((monthData, idx) => renderYearCell(monthData))
    );
  }

  function renderYearCell(yearItem: Calendar.YearItem) {
    const selected = datePickerCtrl.hasSelectedYear(yearItem.year);
    const currentHighlighted = props.highlightToday && yearItem.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearItem.disabled,
          'cal-cell--current': yearItem.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected,
          'cal-cell--in-selection-range': yearItem.inSelectionRange,
          'cal-cell--first-in-selection-range': yearItem.firstInSelectionRange,
          'cal-cell--last-in-selection-range': yearItem.lastInSelectionRange
        }),
        'data-year': getYearString(yearItem.year),
        'data-subject': yearItem.disabled ? null : 'year'
      },
      i18n.formatYear(yearItem.year)
    );
  }

  function renderCenturySheet(centuryData: Calendar.CenturyData) {
    return div(
      { class: 'cal-sheet cal-sheet--century' },
      centuryData.decades.map((decadeData, idx) => renderDecadeCell(decadeData))
    );
  }

  function renderDecadeCell(decadeItem: Calendar.DecadeItem) {
    const currentHighlighted = props.highlightToday && decadeItem.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': decadeItem.disabled,
          'cal-cell--current': decadeItem.current,
          'cal-cell--current-highlighted': currentHighlighted
        }),
        'data-year': getYearString(decadeItem.firstYear),
        'data-subject': decadeItem.disabled ? null : 'decade'
      },
      i18n
        .getDecadeTitle(decadeItem.firstYear, 10)
        .replaceAll('\u2013', '\u2013\u200B')
    );
  }

  function renderTime(type: 'time' | 'time2') {
    const hour =
      type === 'time'
        ? datePickerCtrl.getActiveHour()
        : datePickerCtrl.getActiveHour2();

    const minute =
      type === 'time'
        ? datePickerCtrl.getActiveMinute()
        : datePickerCtrl.getActiveMinute2();

    const timeDate = new Date(1970, 0, 1, hour, minute);
    let time = '';
    let dayPeriod = '';

    const parts = new Intl.DateTimeFormat(i18n.getLocale(), {
      hour: '2-digit',
      minute: '2-digit'
    }).formatToParts(timeDate);

    if (
      parts.length > 4 &&
      parts[parts.length - 1].type === 'dayPeriod' &&
      parts[parts.length - 2].type === 'literal' &&
      parts[parts.length - 2].value === ' '
    ) {
      time = parts
        .slice(0, -2)
        .map((it) => it.value)
        .join('');

      dayPeriod = parts[parts.length - 1].value;
    } else {
      time = parts.map((it) => it.value).join('');
    }

    let dateNode: VNode = null;

    if (
      props.selectionMode === 'dateTime' ||
      props.selectionMode === 'dateTimeRange'
    ) {
      const date = new Date(); // TODO!!!!!!!!

      const formattedDate = new Intl.DateTimeFormat(i18n.getLocale(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);

      let fromOrToLabel = '';

      if (props.selectionMode === 'dateTimeRange') {
        const selectionSize = datePickerCtrl.getSelectionSize();

        if (selectionSize > 1) {
          fromOrToLabel = (type === 'time' ? 'from:' : 'to:') + '\u00a0\u00a0';
        }
      }

      dateNode = h(
        'div',
        { class: 'cal-time-date' },
        fromOrToLabel,
        formattedDate
      );
    }

    return div(
      {
        class: 'cal-time'
      },
      dateNode,
      time,
      !dayPeriod ? null : span({ class: 'cal-day-period' }, dayPeriod)
    );
  }

  function renderTimeLinks() {
    const selectionSize = datePickerCtrl.getSelectionSize();

    return div(
      { class: 'cal-time-links' },
      renderTimeLink('time'),
      selectionSize > 1 ? renderTimeLink('time2') : null
    );
  }

  function renderTimeLink(type: 'time' | 'time2') {
    let hour = 0;
    let minute = 0;

    let timeString = '';

    if (datePickerCtrl.getSelectionSize() > 0) {
      if (type === 'time') {
        hour = datePickerCtrl.getActiveHour();
        minute = datePickerCtrl.getActiveMinute();
      } else {
        hour = datePickerCtrl.getActiveHour2();
        minute = datePickerCtrl.getActiveMinute2();
      }

      const date = new Date(2000, 0, 1, hour, minute);

      timeString = new Intl.DateTimeFormat(i18n.getLocale(), {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
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

  function renderTimeSelector(type: 'time' | 'time2') {
    const selectionMode = props.selectionMode;

    let hour = 0;
    let minute = 0;

    if (type === 'time') {
      hour = datePickerCtrl.getActiveHour();
      minute = datePickerCtrl.getActiveMinute();
    } else {
      hour = datePickerCtrl.getActiveHour2();
      minute = datePickerCtrl.getActiveMinute2();
    }

    return div(
      null,
      div(
        { class: 'cal-time-selector' },
        renderTime(type),
        div({ class: 'cal-hours-headline' }, 'Hours'),
        input({
          'type': 'range',
          'class': 'cal-hour-slider',
          'value': hour,
          'min': 0,
          'max': 23,
          'data-subject': 'hours' + (type === 'time2' ? '2' : '')
        }),
        div({ class: 'cal-minutes-headline' }, 'Minutes'),
        input({
          'type': 'range',
          'class': 'cal-minute-slider',
          'value': minute,
          'min': 0,
          'max': 59,
          'data-subject': 'minutes' + (type === 'time2' ? '2' : '')
        })
      ),
      selectionMode !== 'dateTime' && selectionMode !== 'dateTimeRange'
        ? null
        : a(
            { 'class': 'cal-back-link', 'data-subject': 'view-month' },
            'Back to month'
          )
    );
  }

  return render();
}

// cSpell:words vdom
