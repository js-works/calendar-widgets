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

  export type DayItem = Readonly<{
    year: number;
    month: number;
    day: number;
    calendarWeek: CalendarWeek;
    current: boolean; // true if today, else false
    weekend: boolean; // true if weekend day, else false
    disabled: boolean;
    outOfMinMaxRange: boolean;
    inSelectionRange: boolean;
    firstInSelectionRange: boolean;
    lastInSelectionRange: boolean;
    adjacent: boolean;
  }>;

  export type MonthItem = Readonly<{
    year: number;
    month: number; // 0 -> january, ..., 11 -> december
    current: boolean; // true if current month, else false
    outOfMinMaxRange: boolean;
    disabled: boolean;
  }>;

  export type YearItem = Readonly<{
    year: number;
    current: boolean; // true if current year, else false
    outOfMinMaxRange: boolean;
    disabled: boolean;
  }>;

  export type DecadeItem = Readonly<{
    firstYear: number;
    lastYear: number;
    current: boolean; // true if current decade, else false
    outOfMinMaxRange: boolean;
    disabled: boolean;
  }>;

  export type MonthData = Readonly<{
    year: number;
    month: number; // 0 -> january, ..., 11 -> december
    days: DayItem[];
    weekdays: number[];
    prevDisabled: boolean;
    nextDisabled: boolean;
  }>;

  export type YearData = Readonly<{
    year: number;
    months: readonly MonthItem[];
    prevDisabled: boolean;
    nextDisabled: boolean;
  }>;

  export type DecadeData = Readonly<{
    startYear: number;
    endYear: number;
    years: readonly YearItem[];
    prevDisabled: boolean;
    nextDisabled: boolean;
  }>;

  export type CenturyData = Readonly<{
    decades: readonly DecadeItem[];
    prevDisabled: boolean;
    nextDisabled: boolean;
  }>;
}

// === Calendar ==============================================

class Calendar {
  #options: Calendar.Options;

  constructor(options: Calendar.Options) {
    this.#options = options;
  }

  getMonthData(params: {
    year: number;
    month: number;

    selectionRange?: {
      start: { year: number; month: number; day: number };
      end: { year: number; month: number; day: number };
    } | null;
  }): Calendar.MonthData {
    // we also allow month values less than 0 and greater than 11
    const n = params.year * 12 + params.month;
    const year = Math.floor(n / 12);
    const month = n % 12;

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

    const days: Calendar.DayItem[] = [];

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

      let inSelectionRange = false;
      let firstInSelectionRange = false;
      let lastInSelectionRange = false;

      if (params.selectionRange) {
        const {
          year: startYear,
          month: startMonth,
          day: startDay
        } = params.selectionRange.start;

        const {
          year: endYear,
          month: endMonth,
          day: endDay
        } = params.selectionRange.end;

        const startDate = new Date(startYear, startMonth, startDay);
        const endDate = new Date(endYear, endMonth, endDay);

        if (startDate.getTime() <= endDate.getTime()) {
          inSelectionRange = inDateRange(cellDate, startDate, endDate);

          firstInSelectionRange =
            inSelectionRange && cellDate.getTime() === startDate.getTime();

          lastInSelectionRange =
            inSelectionRange && cellDate.getTime() === endDate.getTime();
        }
      }

      days.push({
        year: cellYear,
        month: cellMonth,
        day: cellDay,
        disabled: (options.disableWeekends && weekend) || outOfMinMaxRange,
        outOfMinMaxRange,
        inSelectionRange,
        firstInSelectionRange,
        lastInSelectionRange,
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

    const minMonth = options.minDate
      ? options.minDate.getFullYear() * 12 + options.minDate.getMonth()
      : null;

    const maxMonth = options.maxDate
      ? options.maxDate.getFullYear() * 12 + options.maxDate.getMonth()
      : null;

    const mon = year * 12 + month;

    const prevDisabled =
      mon <= 24 || !inNumberRange(mon - 1, minMonth, maxMonth);

    const nextDisabled = !inNumberRange(mon + 1, minMonth, maxMonth);

    return {
      year,
      month,
      days,
      weekdays,
      prevDisabled,
      nextDisabled
    };
  }

  getYearData(params: {
    year: number; //
  }): Calendar.YearData {
    const year = params.year;
    const options = this.#options;
    const months: Calendar.MonthItem[] = [];
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();

    const minMonth = options.minDate
      ? options.minDate.getFullYear() * 12 + options.minDate.getMonth()
      : null;

    const maxMonth = options.maxDate
      ? options.maxDate.getFullYear() * 12 + options.maxDate.getMonth()
      : null;

    for (let cellMonth = 0; cellMonth < 12; ++cellMonth) {
      const outOfMinMaxRange = !inNumberRange(
        year * 12 + cellMonth,
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

    const minYear = options.minDate ? options.minDate.getFullYear() : null;
    const maxYear = options.maxDate ? options.maxDate.getFullYear() : null;

    const prevDisabled =
      year <= 1 || !inNumberRange(year - 1, minYear, maxYear);

    const nextDisabled = !inNumberRange(year + 1, minYear, maxYear);

    return {
      year,
      months,
      prevDisabled,
      nextDisabled
    };
  }

  getDecadeData(params: {
    year: number; //
  }): Calendar.DecadeData {
    const year = params.year;
    const options = this.#options;
    const startYear = year - (year % 10);
    const endYear = startYear + 11;
    const currYear = new Date().getFullYear();
    const years: Calendar.YearItem[] = [];
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

    const minDecade = options.minDate
      ? Math.floor(options.minDate.getFullYear() / 10)
      : null;

    const maxDecade = options.maxDate
      ? Math.floor(options.maxDate.getFullYear() / 10)
      : null;

    const decade = Math.floor(year / 10);

    const prevDisabled =
      year <= 1 || !inNumberRange(decade - 1, minDecade, maxDecade);

    const nextDisabled = !inNumberRange(decade + 1, minDecade, maxDecade);

    return {
      startYear,
      endYear,
      years,
      prevDisabled,
      nextDisabled
    };
  }

  getCenturyData(params: {
    year: number; //
  }): Calendar.CenturyData {
    const year = params.year;
    const options = this.#options;
    const startYear = year - (year % 100);
    const endYear = startYear + 119;
    const currYear = new Date().getFullYear();
    const decades: Calendar.DecadeItem[] = [];

    const minYear = options.minDate
      ? Math.floor(options.minDate.getFullYear() / 10) * 10
      : null;

    const maxYear = options.maxDate
      ? Math.floor(options.maxDate.getFullYear() / 10) * 10 + 9
      : null;

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

    const minCentury = options.minDate
      ? Math.floor(options.minDate.getFullYear() / 100)
      : null;

    const maxCentury = options.maxDate
      ? Math.floor(options.maxDate.getFullYear() / 100)
      : null;

    const century = Math.floor(year / 100);

    const prevDisabled =
      year <= 1 || !inNumberRange(century - 1, minCentury, maxCentury);

    const nextDisabled = !inNumberRange(century + 1, minCentury, maxCentury);

    return {
      decades,
      prevDisabled,
      nextDisabled
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
