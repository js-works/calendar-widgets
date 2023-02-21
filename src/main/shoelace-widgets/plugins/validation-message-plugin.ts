import { Plugin } from '../misc/plugins';

export function validationMessagePlugin(): Plugin {
  return {
    id: Symbol('validationMessage'),

    mapOptions: (options) => {
      const mapper = options.validationMessageMapper;

      return {
        validationMessageMapper: (msg, elem, validity) =>
          // TODO!!!!
          !mapper ? msg : mapper(msg, elem, validity)
      };
    }
  };
}
