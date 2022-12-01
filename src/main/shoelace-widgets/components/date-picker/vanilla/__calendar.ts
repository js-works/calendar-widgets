import { h, renderToString, VNode } from './vdom';
import { I18n } from './__i18n';

import {
  getYearMonthString,
  getYearMonthDayString,
  getYearWeekString,
  inDateRange,
  inNumberRange,
  today
} from './__utils';

export { Calendar, Sheet, SheetItem };

type SheetItem = {
  key: string;
  selectionKey: string;
  name: string;
  current: boolean;
  highlighted: boolean;
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
  columnCount: number;
  highlightedColumns: number[] | null;
  columnNames: string[] | null;
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
    highlightCurrent?: boolean;
    highlightWeekends?: boolean;
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
        const calendarWeek = this.#i18n.getCalendarWeek(itemDate);

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
        current: today().getTime() === itemDate.getTime(),
        highlighted: !!(params.highlightWeekends && weekend),
        adjacent
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
      rowNames = [];

      for (let i = 0; i < dayItems.length / 7; ++i) {
        // TODO!!!!!!!!!!!
        const weekNumber = this.#i18n.getCalendarWeek(
          new Date(dayItems[i * 7].key)
        ).week;

        rowNames.push(this.#i18n.formatWeekNumber(weekNumber));
      }
    }

    const highlightedColumns = params.highlightWeekends
      ? this.#i18n.getWeekendDays().map((it) => (it + firstDayOfWeek) % 7)
      : null;

    return {
      key: getYearMonthString(year, month),
      name: nameOfMonth,
      items: dayItems,
      columnCount: 7,
      highlightedColumns,
      columnNames: this.#i18n.getWeekdayNames('short', true),
      rowNames,
      prevDisabled,
      nextDisabled
    };
  }

  getYearData(params: {
    year: number; //
    minDate: Date | null;
    maxDate: Date | null;
    selectionRange?: {
      start: { year: number; month: number };
      end: { year: number; month: number };
    } | null;
  }): Sheet {
    const year = params.year;
    const monthItems: SheetItem[] = [];
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();

    const minMonth = params.minDate
      ? params.minDate.getFullYear() * 12 + params.minDate.getMonth()
      : null;

    const maxMonth = params.maxDate
      ? params.maxDate.getFullYear() * 12 + params.maxDate.getMonth()
      : null;

    for (let itemMonth = 0; itemMonth < 12; ++itemMonth) {
      const outOfMinMaxRange = !inNumberRange(
        year * 12 + itemMonth,
        minMonth,
        maxMonth
      );

      let inSelectedRange = false;
      let firstInSelectedRange = false;
      let lastInSelectedRange = false;

      if (params.selectionRange) {
        const { year: startYear, month: startMonth } =
          params.selectionRange.start;

        const { year: endYear, month: endMonth } = params.selectionRange.end;

        const startValue = startYear * 12 + startMonth;
        const endValue = endYear * 12 + endMonth;

        if (startValue <= endValue) {
          const itemValue = year * 12 + itemMonth;

          inSelectedRange = inNumberRange(
            year * 12 + itemMonth,
            startValue,
            endValue
          );

          firstInSelectedRange = inSelectedRange && itemValue === startValue;
          lastInSelectedRange = inSelectedRange && itemValue === endValue;
        }
      }

      const key = getYearMonthString(year, itemMonth);

      monthItems.push({
        key: key,
        selectionKey: key,
        name: this.#i18n.getMonthName(itemMonth, 'short'),
        current: year === currYear && itemMonth === currMonth,
        adjacent: false,
        highlighted: false,
        outOfMinMaxRange,
        inSelectedRange,
        firstInSelectedRange,
        lastInSelectedRange,
        disabled: outOfMinMaxRange
      });
    }

    const minYear = params.minDate ? params.minDate.getFullYear() : null;
    const maxYear = params.maxDate ? params.maxDate.getFullYear() : null;

    const prevDisabled =
      year <= 1 || !inNumberRange(year - 1, minYear, maxYear);

    const nextDisabled = !inNumberRange(year + 1, minYear, maxYear);

    return {
      key: String(year),
      name: this.#i18n.formatYear(year),
      columnCount: 4,
      highlightedColumns: null,
      columnNames: null,
      rowNames: null,
      prevDisabled,
      nextDisabled,
      items: monthItems
    };
  }
}

// === local helpers =================================================

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
