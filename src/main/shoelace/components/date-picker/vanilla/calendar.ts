// === exports =======================================================

export { Calendar };

// === exported types ================================================

namespace Calendar {
  export type CalendarWeek = { year: number; week: number };

  export type Options = Readonly<{
    firstDayOfWeek: number;
    weekendDays: readonly number[];
    getCalendarWeek: (date: Date, firstDayOfWeek: number) => CalendarWeek;
    minDate: Date | null;
    maxDate: Date | null;
    disableWeekends: boolean;
    alwaysShow42Days: boolean;
  }>;

  export type DayData = Readonly<{
    year: number;
    month: number;
    day: number;
    calendarWeek: CalendarWeek;
    current: boolean; // true if today, else false
    weekend: boolean; // true if weekend day, else false
    disabled: boolean;
    outOfMinMaxRange: boolean;
    adjacent: boolean;
  }>;

  export type MonthData = Readonly<{
    year: number;
    month: number; // 0 -> january, ..., 11 -> december
    current: boolean; // true if current month, else false
    outOfMinMaxRange: boolean;
    disabled: boolean;
  }>;

  export type YearData = Readonly<{
    year: number;
    current: boolean; // true if current year, else false
    outOfMinMaxRange: boolean;
    disabled: boolean;
  }>;

  export type DecadeData = Readonly<{
    firstYear: number;
    lastYear: number;
    current: boolean; // true if current decade, else false
    outOfMinMaxRange: boolean;
    disabled: boolean;
  }>;

  export type MonthView = Readonly<{
    year: number;
    month: number; // 0 -> january, ..., 11 -> december
    days: DayData[];
    weekdays: number[];
    prevMonthDisabled: boolean;
    nextMonthDisabled: boolean;
  }>;

  export type YearView = Readonly<{
    year: number;
    months: readonly MonthData[];
    prevYearDisabled: boolean;
    nextYearDisabled: boolean;
  }>;

  export type DecadeView = Readonly<{
    startYear: number;
    endYear: number;
    years: readonly YearData[];
    prevDecadeDisabled: boolean;
    nextDecadeDisabled: boolean;
  }>;

  export type CenturyView = Readonly<{
    decades: readonly DecadeData[];
    prevCenturyDisabled: boolean;
    nextCenturyDisabled: boolean;
  }>;
}

// === Calendar ==============================================

class Calendar {
  #options: Calendar.Options;

  constructor(options: Calendar.Options) {
    this.#options = options;
  }

  getMonthView(year: number, month: number): Calendar.MonthView {
    // we also allow month values less than 0 and greater than 11
    const n = year * 12 + month;
    year = Math.floor(n / 12);
    month = n % 12;

    const options = this.#options;
    const firstDayOfWeek = options.firstDayOfWeek;
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

    if (!options.alwaysShow42Days) {
      daysToShow = getDayCountOfMonth(year, month) + remainingDaysOfLastMonth;

      if (daysToShow % 7 > 0) {
        daysToShow += 7 - (daysToShow % 7);
      }
    }

    const days: Calendar.DayData[] = [];

    for (let i = 0; i < daysToShow; ++i) {
      let cellYear: number;
      let cellMonth: number;
      let cellDay: number;
      let adjacent = false;

      if (i < remainingDaysOfLastMonth) {
        cellDay = dayCountOfLastMonth - remainingDaysOfLastMonth + i + 1;
        cellMonth = month === 0 ? 11 : month - 1;
        cellYear = month === 0 ? year - 1 : year;
        adjacent = true;
      } else {
        cellDay = i - remainingDaysOfLastMonth + 1;

        if (cellDay > dayCountOfCurrMonth) {
          cellDay = cellDay - dayCountOfCurrMonth;
          cellMonth = month === 11 ? 0 : month + 1;
          cellYear = month === 11 ? year + 1 : year;
          adjacent = true;
        } else {
          cellMonth = month;
          cellYear = year;
          adjacent = false;
        }
      }

      const cellDate = new Date(cellYear, cellMonth, cellDay);
      const weekend = options.weekendDays.includes(cellDate.getDay());

      const outOfMinMaxRange = !inDateRange(
        cellDate,
        options.minDate,
        options.maxDate
      );

      days.push({
        year: cellYear,
        month: cellMonth,
        day: cellDay,
        disabled: (options.disableWeekends && weekend) || outOfMinMaxRange,
        outOfMinMaxRange,
        adjacent,
        weekend,

        calendarWeek: options.getCalendarWeek(
          new Date(cellYear, cellMonth, cellDay),
          firstDayOfWeek
        ),

        current:
          cellYear === currYear &&
          cellMonth === currMonth &&
          cellDay === currDay
      });
    }

    const weekdays: number[] = [];

    for (let i = 0; i < 7; ++i) {
      weekdays.push((i + options.firstDayOfWeek) % 7);
    }

    return {
      year,
      month,
      days,
      weekdays,
      prevMonthDisabled: false, // TODO!!
      nextMonthDisabled: false // TODO!!!
    };
  }

  getYearView(year: number): Calendar.YearView {
    const options = this.#options;
    const months: Calendar.MonthData[] = [];
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();

    const minMonth = options.minDate
      ? options.minDate.getFullYear() * 100 + options.minDate.getMonth()
      : null;

    const maxMonth = options.maxDate
      ? options.maxDate.getFullYear() * 100 + options.maxDate.getMonth()
      : null;

    for (let cellMonth = 0; cellMonth < 12; ++cellMonth) {
      const outOfMinMaxRange = !inNumberRange(
        currYear * 100 + cellMonth,
        minMonth,
        maxMonth
      );

      months.push({
        year,
        month: cellMonth,
        current: year === currYear && cellMonth === currMonth,
        outOfMinMaxRange,
        disabled: outOfMinMaxRange
      });
    }

    return {
      year,
      months,
      prevYearDisabled: false, // TODO!!!
      nextYearDisabled: false // TODO!!!
    };
  }

  getDecadeView(year: number): Calendar.DecadeView {
    const options = this.#options;
    const startYear = year - (year % 10);
    const endYear = startYear + 11;
    const currYear = new Date().getFullYear();
    const years: Calendar.YearData[] = [];
    const minYear = options.minDate ? options.minDate.getFullYear() : null;
    const maxYear = options.maxDate ? options.maxDate.getFullYear() : null;

    for (let cellYear = startYear; cellYear <= endYear; ++cellYear) {
      const outOfMinMaxRange = !inNumberRange(cellYear, minYear, maxYear);

      years.push({
        current: cellYear === currYear,
        year: cellYear,
        outOfMinMaxRange,
        disabled: outOfMinMaxRange
      });
    }

    return {
      startYear,
      endYear,
      years,
      prevDecadeDisabled: false, // TODO!!!
      nextDecadeDisabled: false // TODO!!!
    };
  }

  getCenturyView(year: number): Calendar.CenturyView {
    const options = this.#options;
    const startYear = year - (year % 100);
    const endYear = startYear + 119;
    const currYear = new Date().getFullYear();
    const decades: Calendar.DecadeData[] = [];

    const minYear = options.minDate
      ? Math.floor(options.minDate.getFullYear() / 10) * 10
      : null;

    const maxYear = options.maxDate
      ? Math.floor(options.maxDate.getFullYear() / 10) * 10 + 9
      : null;
    console.log(minYear, maxYear);
    for (let cellYear = startYear; cellYear <= endYear; cellYear += 10) {
      const outOfMinMaxRange = !inNumberRange(cellYear, minYear, maxYear);

      decades.push({
        current: cellYear <= currYear && cellYear + 10 > currYear,
        firstYear: cellYear,
        lastYear: cellYear + 9,
        outOfMinMaxRange,
        disabled: outOfMinMaxRange
      });
    }

    return {
      decades,
      prevCenturyDisabled: false, // TODO!!!
      nextCenturyDisabled: false // TODO!!!
    };
  }
}

// === helpers =======================================================

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
