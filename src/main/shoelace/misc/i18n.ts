import { LitElement } from 'lit';
import { LocalizeController } from '@shoelace-style/localize';

// === exports =======================================================

export { getDirection, getLanguage, translate };

// === local data ====================================================

// need for function `translate`
//const dummyElement = new HTMLElement();
//const dummyLocalize = new LocalizeController(dummyElement);

// === exported functions ============================================

function translate(lang: string, key: string): string {
  return key;
  //dummyElement.lang = lang;

  //return dummyLocalize.term(key) || '';
}

function getLanguage(node: Node): string {
  return 'en-US';
}

function getDirection(node: Node): string {
  return 'ltr';
}
