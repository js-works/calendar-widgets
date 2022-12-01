export {
  classMap,
  getHourMinuteString,
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearWeekString,
  inDateRange,
  inNumberRange,
  today
};

function getYearMonthDayString(year: number, month: number, day: number) {
  const y = year.toString().padStart(4, '0');
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');

  return `${y}-${m}-${d}`;
}

function getYearMonthString(year: number, month: number) {
  const y = year.toString().padStart(4, '0');
  const m = (month + 1).toString().padStart(2, '0');

  return `${y}-${m}`;
}

function getYearWeekString(year: number, week: number) {
  const y = year.toString().padStart(4, '0');
  const w = week.toString().padStart(2, '0');

  return `${y}-W${w}`;
}

function getYearString(year: number) {
  return year.toString();
}

function getHourMinuteString(hour: number, minute: number) {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');

  return `${h}:${m}`;
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

function classMap(classes: Record<string, unknown>): string {
  const arr: string[] = [];

  for (const key of Object.keys(classes)) {
    if (classes[key]) {
      arr.push(key);
    }
  }

  return arr.join(' ');
}

function today(): Date {
  const ret = new Date();

  ret.setHours(0);
  ret.setMinutes(0);
  ret.setSeconds(0);
  ret.setMilliseconds(0);

  return ret;
}
