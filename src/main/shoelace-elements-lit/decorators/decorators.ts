import { CSSResult, LitElement, ReactiveController } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getPluginOption } from 'shoelace-elements';
import { makeElementPluginable } from '../../shoelace-elements-internal/plugins/pluginable';

// === exports =======================================================

export { shoelaceElement, shoelaceFormField };

// === types ==========================================================

// === exported functions =============================================

function shoelaceElement(params: {
  tag: string;
  styles?: CSSResult | CSSResult[];
  uses?: any;
}): <T extends typeof LitElement>(constructor: T) => T {
  return <T extends typeof LitElement>(constructor: T) => {
    const clazz: any = class extends (constructor as any) {
      static styles = params.styles || null;

      constructor() {
        super();
        const config = getPluginOption('shoelace-elements/lit');
        config?.onElementInit?.(this as unknown as LitElement);
        makeElementPluginable(this as unknown as LitElement);
      }
    };

    Object.defineProperty(clazz, 'name', {
      value: constructor.name
    });

    const ret = customElement(params.tag)(clazz);
    return ret as any;
  };
}

function shoelaceFormField(params: {
  tag: string;
  styles?: CSSResult | CSSResult[];
  uses?: any[];
}): <T extends typeof LitElement>(constructor: T) => T {
  return (constructor) => {
    const ret = shoelaceElement(params)(constructor);

    (ret as unknown as typeof LitElement).addInitializer((elem) => {
      const config = getPluginOption('shoelace-elements/lit');
      config?.onFormFieldInit?.(elem as LitElement);
    });

    return ret;
  };
}
