export type { Calendar, Sheet, SheetItem };

type SheetItem = {
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

interface Sheet {
  name: string;
  previous: { year: number; month?: number } | null;
  next: { year: number; month?: number } | null;
  columnCount: number;
  highlightedColumns: number[] | null;
  columnNames: string[] | null;
  rowNames: string[] | null;
  items: SheetItem[];
}

interface Calendar {
  getMonthSheet(params: {
    year: number;
    month: number;
    selectWeeks: boolean;
    calendarSize: 'default' | 'minimal' | 'maximal';
    showWeekNumbers: boolean;
    highlightCurrent: boolean;
    highlightWeekends: boolean;
    disableWeekends: boolean;
    minDate: Date | null;
    maxDate: Date | null;
  }): Sheet;

  getYearSheet(params: {
    year: number;
    selectQuarters: boolean;
    minDate: Date | null;
    maxDate: Date | null;
  }): Sheet;

  getDecadeSheet(params: {
    year: number;
    minDate: Date | null;
    maxDate: Date | null;
  }): Sheet;

  getCenturySheet(params: {
    year: number;
    minDate: Date | null;
    maxDate: Date | null;
  }): Sheet;
}
