export type { Calendar };

namespace Calendar {
  export type Date = {
    year: number;
    month: number;
    day: number;
  };

  export type Time = {
    hours: number;
    minutes: number;
  };

  export type SheetItem = {
    year: number;
    month?: number;
    day?: number;
    weekYear?: number;
    weekNumber?: number;
    name: string;
    current: boolean;
    highlighted: boolean;
    adjacent: boolean;
    disabled: boolean;
    outOfMinMaxRange: boolean;
  };

  export interface Sheet {
    name: string;
    previous: { year: number; month?: number } | null;
    next: { year: number; month?: number } | null;
    columnCount: number;
    highlightedColumns: number[] | null;
    columnNames: string[] | null;
    rowNames: string[] | null;
    items: SheetItem[];
  }
}

interface Calendar {
  today(): Calendar.Date;
  formatDate(date: Calendar.Date): string;
  formatTime(time: Calendar.Time): string;
  convertDate(date: Date): Calendar.Date;
  convertDate(date: Calendar.Date): Date;

  getMonthSheet(params: {
    year: number;
    month: number;
    selectWeeks: boolean;
    calendarSize: 'default' | 'minimal' | 'maximal';
    showWeekNumbers: boolean;
    highlightCurrent: boolean;
    highlightWeekends: boolean;
    disableWeekends: boolean;
    minDate: Calendar.Date | null;
    maxDate: Calendar.Date | null;
  }): Calendar.Sheet;

  getYearSheet(params: {
    year: number;
    selectQuarters: boolean;
    minDate: Calendar.Date | null;
    maxDate: Calendar.Date | null;
  }): Calendar.Sheet;

  getDecadeSheet(params: {
    year: number;
    minDate: Calendar.Date | null;
    maxDate: Calendar.Date | null;
  }): Calendar.Sheet;

  getCenturySheet(params: {
    year: number;
    minDate: Calendar.Date | null;
    maxDate: Calendar.Date | null;
  }): Calendar.Sheet;
}
