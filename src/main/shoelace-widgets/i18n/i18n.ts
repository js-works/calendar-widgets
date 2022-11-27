import type { ReactiveControllerHost } from 'lit';
import { LocalizeController } from '@shoelace-style/localize';
import type { Translation } from '@shoelace-style/localize';
import './translations/en';

// === exports =======================================================

export { getDirection, getLanguage, translate, LocalizeController };
export type { Translations };

// === exported types ================================================

interface Translations extends Translation {
  'shoelaceWidgets.dialogs/cancel': string;
  'shoelaceWidgets.dialogs/ok': string;
  'shoelaceWidgets.dialogs/titleApprove': string;
  'shoelaceWidgets.dialogs/titleConfirm': string;
  'shoelaceWidgets.dialogs/titleError': string;
  'shoelaceWidgets.dialogs/titleInfo': string;
  'shoelaceWidgets.dialogs/titleInput': string;
  'shoelaceWidgets.dialogs/titlePrompt': string;
  'shoelaceWidgets.dialogs/titleSuccess': string;
  'shoelaceWidgets.dialogs/titleWarn': string;
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
