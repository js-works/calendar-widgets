export declare global {
  namespace ShoelaceElements {
    interface PluginOptions {
      'shoelace-elements/lit': {
        onElementInit?: (elem: LitElement) => void;
        onFormFieldInit?: (elem: LitElement) => void;

        // will be used to map the return value of the component's
        // `render` function
        mapFormFieldContent?: (
          content: unknown,
          element: LitElement
        ) => unknown;

        // will allow track the invocation of the `render`
        // method - useful reactive libraries like Mobx etc.
        trackRendering?: (action: () => void, element: LitElement) => void;
      };
    }
  }
}
