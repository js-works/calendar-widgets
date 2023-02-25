import type { ReactiveControllerHost } from 'lit';
import { LocalizeController } from '@shoelace-style/localize';
import type { Translation } from '@shoelace-style/localize';
import './translations/en';

// === exports =======================================================

export { getDirection, getLanguage, translate, LocalizeController };
export type { Translations };

// === exported types ================================================

interface Translations extends Translation {
  'shoelaceElements.dialogs/cancel': string;
  'shoelaceElements.dialogs/ok': string;
  'shoelaceElements.dialogs/titleApprove': string;
  'shoelaceElements.dialogs/titleConfirm': string;
  'shoelaceElements.dialogs/titleError': string;
  'shoelaceElements.dialogs/titleInfo': string;
  'shoelaceElements.dialogs/titleInput': string;
  'shoelaceElements.dialogs/titlePrompt': string;
  'shoelaceElements.dialogs/titleSuccess': string;
  'shoelaceElements.dialogs/titleWarn': string;
}

// === local data ====================================================

// need for function `translate`
let dummyElement: HTMLElement | null = null;
let dummyLocalize: LocalizeController | null = null;

// === exported functions ============================================

function translate(lang: string, key: string): string {
  if (!dummyLocalize) {
    dummyElement = document.createElement('div');
    dummyLocalize = new LocalizeController(
      createFakeControllerHostProxy(dummyElement)
    );
  }

  dummyElement!.lang = lang;

  return dummyLocalize.term(key) || '';
}

function getLanguage(elem: HTMLElement): string {
  const host = createFakeControllerHostProxy(elem);
  const localize = new LocalizeController(host);
  return localize.lang();
}

function getDirection(elem: HTMLElement): string {
  const host = createFakeControllerHostProxy(elem);
  const localize = new LocalizeController(host);
  return localize.dir();
}

// === locals ========================================================

function createFakeControllerHostProxy(
  elem: HTMLElement
): HTMLElement & ReactiveControllerHost {
  const host: ReactiveControllerHost = {
    addController() {},
    removeController: () => {},
    requestUpdate: () => {},
    updateComplete: Promise.resolve(true)
  };

  return new Proxy(elem, {
    get(target, prop) {
      return Object.hasOwn(host, prop)
        ? (host as any)[prop]
        : (target as any)[prop];
    }
  }) as HTMLElement & ReactiveControllerHost;
}
