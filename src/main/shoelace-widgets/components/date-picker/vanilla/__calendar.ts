import { h, renderToString } from './vdom';
import { I18n } from './__i18n';

import {
  getYearMonthString,
  getYearMonthDayString,
  getYearWeekString
} from './__utils';

type SheetItem = {
  key: string;
  selectionKey: string;
  name: string;
  current: boolean;
  adjacent: boolean;
  disabled: boolean;
  outOfMinMaxRange: boolean;
  inSelectedRange: boolean;
  firstInSelectedRange: boolean;
  lastInSelectedRange: boolean;
};

interface Sheet {
  key: string;
  name: string;
  prevDisabled: boolean;
  nextDisabled: boolean;
  columnNames: string[];
  rowNames: string[];
  items: SheetItem[];
  disabledColumns: number[];
}

type CalendarWeek = { year: number; week: number };

type CalendarConfig = {
  locale: string;
  disableWeekends: boolean;
  sheetSize: 'default' | 'minimal' | 'maximal';
  minDate: Date | null;
  maxDate: Date | null;
};

class Calendar {
  #config: CalendarConfig;
  #i18n: I18n;

  constructor(config: CalendarConfig) {
    this.#i18n = new I18n(config.locale);
    this.#config = config;
  }

  getMonthSheet(params: {
    year: number;
    month: number;
    selectWeek?: boolean;

    selectedRange?: {
      start: { year: number; month: number; day: number };
      end: { year: number; month: number; day: number };
    } | null;
  }): Sheet {
    // we also allow month values less than 0 and greater than 11
    const n = params.year * 12 + params.month;
    const year = Math.floor(n / 12);
    const month = n % 12;

    const config = this.#config;
    const firstDayOfWeek = this.#i18n.getFirstDayOfWeek();
    const firstWeekdayOfMonth = new Date(year, month, 1).getDay();
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();
    const currDay = now.getDate();
    const dayCountOfCurrMonth = getDayCountOfMonth(year, month);
    const dayCountOfLastMonth = getDayCountOfMonth(year, month - 1);

    const remainingDaysOfLastMonth =
      firstDayOfWeek <= firstWeekdayOfMonth
        ? firstWeekdayOfMonth - firstDayOfWeek
        : 6 - (firstDayOfWeek - firstWeekdayOfMonth);

    let daysToShow = 42;

    if (config.sheetSize === 'maximal') {
      daysToShow = getDayCountOfMonth(year, month) + remainingDaysOfLastMonth;

      if (daysToShow % 7 > 0) {
        daysToShow += 7 - (daysToShow % 7);
      }
    }

    const dayItems: SheetItem[] = [];

    for (let i = 0; i < daysToShow; ++i) {
      let itemYear: number;
      let itemMonth: number;
      let itemDay: number;
      let adjacent = false;

      if (i < remainingDaysOfLastMonth) {
        itemDay = dayCountOfLastMonth - remainingDaysOfLastMonth + i + 1;
        itemMonth = month === 0 ? 11 : month - 1;
        itemYear = month === 0 ? year - 1 : year;
        adjacent = true;
      } else {
        itemDay = i - remainingDaysOfLastMonth + 1;

        if (itemDay > dayCountOfCurrMonth) {
          itemDay = itemDay - dayCountOfCurrMonth;
          itemMonth = month === 11 ? 0 : month + 1;
          itemYear = month === 11 ? year + 1 : year;
          adjacent = true;
        } else {
          itemMonth = month;
          itemYear = year;
          adjacent = false;
        }
      }

      const itemDate = new Date(itemYear, itemMonth, itemDay);
      const weekend = this.#i18n.getWeekendDays().includes(itemDate.getDay());

      const outOfMinMaxRange = !inDateRange(
        itemDate,
        config.minDate,
        config.maxDate
      );

      let inSelectedRange = false;
      let firstInSelectedRange = false;
      let lastInSelectedRange = false;

      if (params.selectedRange) {
        const {
          year: startYear,
          month: startMonth,
          day: startDay
        } = params.selectedRange.start;

        const {
          year: endYear,
          month: endMonth,
          day: endDay
        } = params.selectedRange.end;

        const startDate = new Date(startYear, startMonth, startDay);
        const endDate = new Date(endYear, endMonth, endDay);

        if (startDate.getTime() <= endDate.getTime()) {
          inSelectedRange = inDateRange(itemDate, startDate, endDate);

          firstInSelectedRange =
            inSelectedRange && itemDate.getTime() === startDate.getTime();

          lastInSelectedRange =
            inSelectedRange && itemDate.getTime() === endDate.getTime();
        }
      }

      const key = getYearMonthDayString(itemYear, itemMonth, itemDay);

      let selectionKey = key;

      if (params.selectWeek) {
        const calendarWeek = this.#i18n.getCalendarWeek(
          new Date(itemYear, itemMonth, itemDay)
        );

        selectionKey = getYearWeekString(calendarWeek.year, calendarWeek.week);
      }

      dayItems.push({
        key,
        name: this.#i18n.formatDay(itemDay),
        selectionKey: key,
        disabled: (config.disableWeekends && weekend) || outOfMinMaxRange,
        outOfMinMaxRange,
        inSelectedRange,
        firstInSelectedRange,
        lastInSelectedRange,
        adjacent,

        current:
          itemYear === currYear &&
          itemMonth === currMonth &&
          itemDay === currDay
      });
    }

    const weekdays: number[] = [];

    for (let i = 0; i < 7; ++i) {
      weekdays.push((i + this.#i18n.getFirstDayOfWeek()) % 7);
    }

    const minMonth = config.minDate
      ? config.minDate.getFullYear() * 12 + config.minDate.getMonth()
      : null;

    const maxMonth = config.maxDate
      ? config.maxDate.getFullYear() * 12 + config.maxDate.getMonth()
      : null;

    const mon = year * 12 + month;

    const prevDisabled =
      mon <= 24 || !inNumberRange(mon - 1, minMonth, maxMonth);

    const nextDisabled = !inNumberRange(mon + 1, minMonth, maxMonth);

    const nameOfMonth = this.#i18n.formatDate(new Date(year, month, 1), {
      year: 'numeric',
      month: 'long'
    });

    return {
      key: getYearMonthString(year, month),
      name: nameOfMonth,
      items: dayItems,
      columnNames: [], // TODO
      rowNames: [], // TODO
      disabledColumns: [], // TODO
      prevDisabled,
      nextDisabled
    };
  }
}

export class DatePicker {
  renderToString() {
    const cal = new Calendar({
      locale: 'en-US',
      minDate: null,
      maxDate: null,
      disableWeekends: false,
      sheetSize: 'default'
    });

    const monthSheet = cal.getMonthSheet({ year: 2022, month: 10 });
    console.log(monthSheet);
    return renderToString(h('div', null, 'juhu'));
  }
}

function getDayCountOfMonth(year: number, month: number) {
  // we also allow month values less than 0 and greater than 11
  const n = year * 12 + month;
  year = Math.floor(n / 12);
  month = n % 12;

  if (month !== 1) {
    return (month % 7) % 2 === 0 ? 31 : 30;
  }

  return year % 4 !== 0 || (year % 100 === 0 && year % 400 !== 0) ? 28 : 29;
}

function inNumberRange(
  value: number,
  start: number | null,
  end: number | null
) {
  if (start === null && end === null) {
    return true;
  }

  if (start === null) {
    return value <= end!;
  } else if (end === null) {
    return value >= start;
  } else {
    return value >= start && value <= end;
  }
}
function inDateRange(value: Date, start: Date | null, end: Date | null) {
  if (start === null && end === null) {
    return true;
  }

  const toNumber = (date: Date) =>
    date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

  const val = toNumber(value);

  if (start === null) {
    return val <= toNumber(end!);
  } else if (end === null) {
    return val >= toNumber(start!);
  } else {
    return val >= toNumber(start) && val <= toNumber(end);
  }
}
