import { getPluginOption, Plugin } from '../misc/plugins';

export function validationMessagePlugin(): Plugin {
  return {
    id: 'validationMessage',

    optionsMapper: (options) => {
      const mapper = options.validationMessageMapper;

      return {
        validationMessageMapper: (msg, elem, validity) =>
          // TODO!!!!
          !mapper ? msg : mapper(msg, elem, validity)
      };
    }
  };
}
