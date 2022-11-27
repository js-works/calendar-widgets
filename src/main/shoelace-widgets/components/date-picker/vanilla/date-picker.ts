import { render, renderToString, VElement } from './vdom';
import { renderDatePicker, DatePickerProps } from './date-picker-render';
import { DatePickerController } from './date-picker-controller';

import styles from './date-picker.styles';

// === exports =======================================================

export { DatePicker };

// === exported types ================================================

namespace DatePicker {
  export type SelectionMode = DatePickerController.SelectionMode;
}

// === exported classes ==============================================

class DatePicker {
  static readonly styles = styles;

  readonly #getLocale: () => string;
  readonly #getDirection: () => string;
  readonly #getProps: () => DatePickerProps;
  readonly #datePickerController: DatePickerController;

  constructor(
    root: HTMLElement | Promise<HTMLElement>,
    params: {
      getSelectionMode: () => DatePickerController.SelectionMode;
      getLocale: () => string;
      getDirection: () => string;
      requestUpdate: () => void;
      getProps: () => DatePickerProps;
      onChange: () => void;
    }
  ) {
    this.#getLocale = params.getLocale;
    this.#getDirection = params.getDirection;
    this.#getProps = params.getProps;

    this.#datePickerController = new DatePickerController(root, {
      getSelectionMode: params.getSelectionMode,
      requestUpdate: params.requestUpdate,
      onChange: params.onChange
    });
  }

  getValue() {
    return this.#datePickerController.getValue();
  }

  setValue(value: string) {
    return this.#datePickerController.setValue(value);
  }

  render(target: HTMLElement): void {
    render(target, this.#renderDatePicker());
  }

  renderToString(): string {
    return renderToString(this.#renderDatePicker());
  }

  resetView() {
    this.#datePickerController.resetView();
  }

  #renderDatePicker(): VElement {
    return renderDatePicker(
      this.#getLocale(),
      this.#getDirection() === 'rtl' ? 'rtl' : 'ltr',
      this.#getProps(),
      this.#datePickerController
    );
  }
}

// cSpell:words vdom
