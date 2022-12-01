import { h, renderToString, VNode } from './vdom';
import { I18n } from './__i18n';

import {
  getYearMonthString,
  getYearMonthDayString,
  getYearWeekString,
  inDateRange,
  inNumberRange
} from './__utils';

export { Calendar, Sheet, SheetItem };

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
  rowNames: string[] | null;
  items: SheetItem[];
}

type CalendarWeek = { year: number; week: number };

class Calendar {
  #i18n: I18n;

  constructor(locale: string | (() => string)) {
    this.#i18n = new I18n(locale);
  }

  getMonthSheet(params: {
    year: number;
    month: number;
    sheetSize?: 'default' | 'minimal' | 'maximal';
    minDate?: Date | null;
    maxDate?: Date | null;
    showWeekNumbers?: boolean;
    disableWeekends?: boolean;
    selectWeeks?: boolean;

    selectedRange?: {
      start: { year: number; month: number; day: number };
      end: { year: number; month: number; day: number };
    } | null;
  }): Sheet {
    // we also allow month values less than 0 and greater than 11
    const n = params.year * 12 + params.month;
    const year = Math.floor(n / 12);
    const month = n % 12;

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

    if (params.sheetSize !== 'maximal') {
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
        params.minDate || null,
        params.maxDate || null
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

      if (params.selectWeeks) {
        const calendarWeek = this.#i18n.getCalendarWeek(
          new Date(itemYear, itemMonth, itemDay)
        );

        selectionKey = getYearWeekString(calendarWeek.year, calendarWeek.week);
      }

      dayItems.push({
        key,
        name: this.#i18n.formatDay(itemDay),
        selectionKey,
        disabled: (params.disableWeekends && weekend) || outOfMinMaxRange,
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

    const minMonth = params.minDate
      ? params.minDate.getFullYear() * 12 + params.minDate.getMonth()
      : null;

    const maxMonth = params.maxDate
      ? params.maxDate.getFullYear() * 12 + params.maxDate.getMonth()
      : null;

    const mon = year * 12 + month;

    const prevDisabled =
      mon <= 24 || !inNumberRange(mon - 1, minMonth, maxMonth);

    const nextDisabled = !inNumberRange(mon + 1, minMonth, maxMonth);

    const nameOfMonth = this.#i18n.formatDate(new Date(year, month, 1), {
      year: 'numeric',
      month: 'long'
    });

    let rowNames: string[] | null = null;

    if (params.showWeekNumbers) {
      rowNames = ['a', 'b', 'c', 'd', 'e']; // TODO!!!
    }

    return {
      key: getYearMonthString(year, month),
      name: nameOfMonth,
      items: dayItems,
      columnNames: this.#i18n.getWeekdayNames('short', true),
      rowNames,
      prevDisabled,
      nextDisabled
    };
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
