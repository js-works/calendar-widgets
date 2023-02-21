import type { LitElement, ReactiveController } from 'lit';
import { customElement } from 'lit/decorators.js';
import { initWidget } from 'shoelace-widgets/internal';

export { shoelaceWidget };

function shoelace<T extends { new (): LitElement }>(constructor: T): T {
  const newClass = class extends (constructor as new () => LitElement) {
    constructor() {
      super();
      initWidget(this);
    }
  };

  Object.defineProperty(newClass, 'name', {
    value: constructor.name
  });

  return newClass as T;
}

function shoelaceWidget(
  tagName: string
): <T extends new () => LitElement>(constructor: T) => T;

function shoelaceWidget<T extends new () => LitElement>(constructor: T): T;

function shoelaceWidget(
  arg: string | (new () => LitElement)
):
  | (new () => LitElement)
  | ((constructor: new () => LitElement) => new () => LitElement) {
  return typeof arg === 'string' ? customElement(arg) : shoelace(arg);
}
