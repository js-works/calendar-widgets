export declare global {
  namespace Shoelace {
    interface PluginOptions {
      // will be called each time a component is initialized
      onComponentInit: (element: LitElement) => void;

      // will be used to map the return value of the component's
      // `render` function
      mapRendering: (content: unknown, element: LitElement) => unknown;

      // will allow track the invocation of the `render`
      // method - useful reactive libraries like Mobx etc.
      trackRendering: (action: () => void, element: LitElement) => void;
    }
  }
}
