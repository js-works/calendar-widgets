import { Plugin } from './plugins';

export function validationMessagePlugin(): Plugin {
  return {
    id: Symbol('validationMessage'),

    mapOptions: (options) => {
      const mapper = options.mapValidationMessage;

      return {
        mapValidationMessage: (msg, elem, validity) =>
          // TODO!!!!
          !mapper ? msg : mapper(msg, elem, validity)
      };
    }
  };
}
