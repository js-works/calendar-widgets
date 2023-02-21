import { LitElement } from 'lit';
import type { ReactiveController } from 'lit';
import { getPluginOption } from 'shoelace-widgets';

const patchedPrototypes = new WeakSet<CustomElementConstructor>();

export function initWidget(widget: LitElement) {
  // TODO!!!
  const onComponentInit = getPluginOption('onComponentInit');

  if (onComponentInit) {
    const controller: ReactiveController = {
      hostConnected: () => {
        widget.removeController(controller);
        onComponentInit(widget);
      }
    };

    widget.addController(controller);
  }

  const contentMapper = getPluginOption('componentContentMapper');

  if (contentMapper) {
    const render = (widget as any).render;
    (widget as any).render = () => contentMapper(render.call(widget), widget);
  }

  if ('validationMessage' in widget && 'validity' in widget) {
    const validationMessageMapper = getPluginOption('validationMessageMapper');

    if (
      validationMessageMapper &&
      !patchedPrototypes.has(widget.constructor.prototype)
    ) {
      patchedPrototypes.add(widget.constructor.prototype);

      const descriptor = Object.getOwnPropertyDescriptor(
        widget.constructor.prototype,
        'validationMessage'
      );

      const getValidationMessage = descriptor?.get;

      if (getValidationMessage) {
        Object.defineProperty(widget, 'validationMessage', {
          get: () =>
            validationMessageMapper(
              getValidationMessage.call(widget),
              (widget as any).validity,
              widget
            )
        });
      }
    }
  }
}
