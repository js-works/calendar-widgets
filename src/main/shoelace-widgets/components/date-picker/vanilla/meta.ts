import {
  getYearString,
  getYearMonthDayString,
  getYearMonthString,
  getYearWeekString,
  getYearQuarterString,
  getHourMinuteString
} from './utils';

// === exports =======================================================

export { selectionModeMeta, calendarViewOrder };
export type { CalendarView, TimeView, View };

// == exported types =================================================

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
  | 'quarter'
  | 'quarters'
  | 'quarterRange'
  | 'year'
  | 'years'
  | 'yearRange';

type CalendarView = 'month' | 'year' | 'decade' | 'century';
type TimeView = 'time1' | 'time2';
type View = CalendarView | TimeView;

// === exported values ===============================================

const calendarViewOrder: CalendarView[] = [
  'month',
  'year',
  'decade',
  'century'
];

const selectionModeMeta: Record<
  SelectionMode,
  {
    selectType: 'single' | 'multi' | 'range';
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

  quarter: {
    selectType: 'single',
    initialView: 'year',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearQuarterString(params.year!, Math.floor(params.month! / 3) + 1)
  },

  quarters: {
    selectType: 'multi',
    initialView: 'year',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearQuarterString(params.year!, Math.floor(params.month! / 3) + 1)
  },

  quarterRange: {
    selectType: 'range',
    initialView: 'year',
    kind: 'calendar',

    getSelectionKey: (params) =>
      getYearQuarterString(params.year!, Math.floor(params.month! / 3) + 1)
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
