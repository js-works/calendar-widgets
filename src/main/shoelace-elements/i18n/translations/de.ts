import { registerTranslation } from '@shoelace-style/localize';
import { Translations } from '../i18n';

const translations: Translations = {
  '$code': 'de',
  '$name': 'Deutsch',
  '$dir': 'ltr',

  'shoelaceElements.dialogs/cancel': 'Abbrechen',
  'shoelaceElements.dialogs/ok': 'OK',
  'shoelaceElements.dialogs/titleApprove': 'Zustimmung',
  'shoelaceElements.dialogs/titleConfirm': 'Bestätigung',
  'shoelaceElements.dialogs/titleError': 'Fehler',
  'shoelaceElements.dialogs/titleInfo': 'Information',
  'shoelaceElements.dialogs/titleInput': 'Eingabe',
  'shoelaceElements.dialogs/titlePrompt': 'Eingabe',
  'shoelaceElements.dialogs/titleSuccess': 'Information',
  'shoelaceElements.dialogs/titleWarn': 'Abbrechen'
};

registerTranslation(translations);
