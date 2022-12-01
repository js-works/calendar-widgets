import { Calendar, Sheet, SheetItem } from './__calendar';
import { h, renderToString, VNode } from './vdom';

const [a, div, img, input, span] = ['a', 'div', 'img', 'input', 'span'].map(
  (tag) => h.bind(null, tag)
);

export class DatePicker {
  renderToString() {
    const cal = new Calendar('de-DE');

    const monthSheet = cal.getMonthSheet({
      year: 2022,
      month: 10,
      showWeekNumbers: true,
      selectWeeks: true
    });

    return renderToString(this.#renderSheetView(monthSheet));
  }

  #renderSheetView(sheet: Sheet) {
    return div(
      {
        class: 'cal-base'
      },
      this.#renderSheetNavi(sheet),
      this.#renderSheet(sheet)
    );
  }

  #renderSheetNavi(sheet: Sheet) {
    return div(
      {
        class: 'cal-sheet-navi'
      },
      div(null, '<-'),
      div({ class: 'cal-sheet-title' }, sheet.name),
      div(null, '->')
    );
  }

  #renderSheet(sheet: Sheet) {
    const hasRowNames = this.#sheetHasRowNames(sheet);

    let gridTemplateColumns =
      (hasRowNames ? 'min-content ' : '') +
      `repeat(${sheet.columnNames.length}, 1fr)`;

    return div(
      {
        class: 'cal-sheet',
        style: `grid-template-columns: ${gridTemplateColumns};`
      },
      this.#renderHeader(sheet),
      this.#renderBody(sheet)
    );
  }

  #renderItemCell(item: SheetItem) {
    return div(
      {
        class: 'cal-cell'
      },
      item.name
    );
  }

  #renderHeader(sheet: Sheet) {
    const headerRow = sheet.columnNames.map((it) => h('div', null, it));

    if (this.#sheetHasRowNames(sheet)) {
      headerRow.unshift(div());
    }

    return headerRow;
  }

  #renderBody(sheet: Sheet) {
    const cells: VNode[] = [];

    sheet.items.forEach((item, idx) => {
      if (this.#sheetHasRowNames(sheet) && idx % 7 === 0) {
        cells.push(
          div({ class: 'cal-cell cal-row-name' }, sheet.rowNames![idx / 7])
        );
      }

      cells.push(this.#renderItemCell(item));
    });

    return cells;
  }

  #sheetHasRowNames(sheet: Sheet) {
    return !!sheet.rowNames?.length;
  }
}
