import { Calendar, Sheet, SheetItem } from './__calendar';
import { h, renderToString, VNode } from './vdom';
import { classMap } from './__utils';

// icons
import arrowLeftIcon from './icons/arrow-left.icon';
import arrowRightIcon from './icons/arrow-right.icon';
import timeIcon from './icons/time.icon';

export { DatePicker };

// === types =========================================================

namespace DatePicker {
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
    | 'year'
    | 'years'
    | 'yearRange';

  export type Props = {
    selectionMode: SelectionMode;
    accentuateHeader: boolean;
    showWeekNumbers: boolean;
    sheetSize: 'default' | 'minimal' | 'maximal';
    highlightToday: boolean;
    highlightWeekends: boolean;
    disableWeekends: boolean;
    enableCenturyView: boolean;
    minDate: Date | null;
    maxDate: Date | null;
  };
}

const [a, div, img, input, span] = ['a', 'div', 'img', 'input', 'span'].map(
  (tag) => h.bind(null, tag)
);

class DatePicker {
  #getLocale: () => string;
  #getProps: () => DatePicker.Props;

  constructor(params: {
    getLocale: () => string;
    getProps: () => DatePicker.Props; //
  }) {
    (this.#getLocale = params.getLocale), (this.#getProps = params.getProps);
  }

  renderToString() {
    const props = this.#getProps();
    const cal = new Calendar(this.#getLocale());

    const monthSheet = cal.getMonthSheet({
      year: 2022,
      month: 11,
      showWeekNumbers: props.showWeekNumbers,
      selectWeeks: true,
      disableWeekends: props.disableWeekends,
      highlightWeekends: props.highlightWeekends
    });

    return renderToString(this.#renderSheetView(monthSheet, props));
  }

  #renderSheetView(sheet: Sheet, props: DatePicker.Props) {
    return div(
      {
        class: 'cal-base'
      },
      this.#renderSheetHeader(sheet, props),
      this.#renderSheet(sheet, props)
    );
  }

  #renderSheetHeader(sheet: Sheet, props: DatePicker.Props) {
    return div(
      {
        class: classMap({
          'cal-header': true,
          'cal-header--accentuated': props.accentuateHeader
        })
      },
      div(
        {
          class: classMap({
            'cal-prev': true,
            'cal-prev--disabled': sheet.prevDisabled
          })
        },
        arrowLeftIcon
      ),
      div(
        {
          class: classMap({
            'cal-title': true,
            'cal-title--disabled': sheet.upDisabled
          })
        },
        sheet.name
      ),
      div(
        {
          class: classMap({
            'cal-prev': true,
            'cal-prev--disabled': sheet.prevDisabled
          })
        },
        arrowRightIcon
      )
    );
  }

  #renderSheet(sheet: Sheet, props: DatePicker.Props) {
    const hasRowNames = this.#sheetHasRowNames(sheet);

    let gridTemplateColumns =
      (hasRowNames ? 'min-content ' : '') +
      `repeat(${sheet.columnNames.length}, 1fr)`;

    return div(
      {
        class: 'cal-sheet',
        style: `grid-template-columns: ${gridTemplateColumns};`
      },
      this.#renderTableHead(sheet, props),
      this.#renderTableBody(sheet, props)
    );
  }

  #renderTableCell(item: SheetItem, props: DatePicker.Props) {
    return div(
      {
        class: classMap({
          'cal-cell-container': true,
          'cal-cell-container--highlighted': item.highlighted
        })
      },
      a(
        {
          class: classMap({
            'cal-cell': true,
            'cal-cell--disabled': item.disabled
          })
        },
        item.name
      )
    );
  }

  #renderTableHead(sheet: Sheet, props: DatePicker.Props) {
    const headRow = sheet.columnNames.map((it) =>
      div(
        {
          class: 'cal-column-name'
        },
        it
      )
    );

    if (this.#sheetHasRowNames(sheet)) {
      headRow.unshift(div());
    }

    return headRow;
  }

  #renderTableBody(sheet: Sheet, props: DatePicker.Props) {
    const cells: VNode[] = [];

    sheet.items.forEach((item, idx) => {
      if (this.#sheetHasRowNames(sheet) && idx % 7 === 0) {
        cells.push(
          div({ class: 'cal-cell cal-row-name' }, sheet.rowNames![idx / 7])
        );
      }

      cells.push(this.#renderTableCell(item, props));
    });

    return cells;
  }

  #sheetHasRowNames(sheet: Sheet) {
    return !!sheet.rowNames?.length;
  }
}
