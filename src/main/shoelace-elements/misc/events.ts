import { LitElement } from 'lit';

export { createEmitter };
export type { Listener };

type Cleanup = (() => void) | undefined | null | void;
type Listener<T> = (v: T) => void;

type EventOf<K extends keyof HTMLElementEventMap> =
  HTMLElementEventMap[K] extends CustomEvent
    ? HTMLElementEventMap[K] & { type: K }
    : never;

type EventDetailOf<K extends keyof HTMLElementEventMap> =
  HTMLElementEventMap[K] extends CustomEvent<infer D> ? D : never;

function createEmitter(host: LitElement): (ev: CustomEvent<unknown>) => void;

function createEmitter<K extends keyof HTMLElementEventMap>(
  host: LitElement,
  type: K
): (detail: EventDetailOf<K> extends null ? void : EventDetailOf<K>) => void;

function createEmitter<K extends keyof HTMLElementEventMap>(
  host: LitElement,
  type: K,
  getEventProp: () => Listener<EventOf<K>> | undefined
): (detail: EventDetailOf<K> extends null ? void : EventDetailOf<K>) => void;

function createEmitter(
  host: LitElement,
  type?: string,
  getEventProp?: Function
) {
  if (arguments.length > 0 && typeof type !== 'string') {
    throw new Error('[useEmitter] Invalid type of first argument');
  }

  if (type === undefined) {
    return (ev: CustomEvent<any>) => host.dispatchEvent(ev);
  }

  if (getEventProp) {
    const eventListener = (ev: Event) => {
      const eventProp = getEventProp();

      eventProp && eventProp(ev);
    };

    afterConnect(host, () => {
      host.addEventListener(type, eventListener);

      return () => host.removeEventListener(type, eventListener);
    });
  }

  return <D>(detail: D, options?: CustomEventInit<D>) => {
    const ev = new CustomEvent<D>(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...options,
      detail
    });

    host.dispatchEvent(ev);
  };
}

function afterConnect(component: LitElement, action: () => Cleanup): void {
  let cleanup: Cleanup;

  component.addController({
    hostConnected() {
      if (typeof cleanup === 'function') {
        cleanup();
      }

      cleanup = action();
    },

    hostDisconnected() {
      if (typeof cleanup === 'function') {
        cleanup();
      }

      cleanup = null;
    }
  });
}
