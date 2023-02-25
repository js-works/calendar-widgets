import { CSSResult, LitElement, ReactiveController } from 'lit';
import { customElement } from 'lit/decorators.js';
import { makePluginable } from 'shoelace-elements/internal';

// === exported functions =============================================

export function shoelaceElement(params: {
  tag: string;
  styles?: CSSResult | CSSResult[];
  uses?: any;
}): <T extends typeof LitElement>(constructor: T) => T {
  return <T extends typeof LitElement>(constructor: T) => {
    const clazz: any = class extends (constructor as any) {
      static styles = params.styles || null;
    };

    Object.defineProperty(clazz, 'name', {
      value: constructor.name
    });

    makePluginable(clazz);
    const ret = customElement(params.tag)(clazz);
    return ret as any;
  };
}

export function shoelaceFormField(params: {
  tag: string;
  styles?: CSSResult | CSSResult[];
  uses?: any[];
}): <T extends typeof LitElement>(constructor: T) => T {
  return <T extends typeof LitElement>(constructor: T) => {
    const clazz: any = class extends (constructor as any) {
      static styles = params.styles || null;
    };

    Object.defineProperty(clazz, 'name', {
      value: constructor.name
    });

    makePluginable(clazz);
    const ret = customElement(params.tag)(clazz);
    return ret as any;
  };
}
