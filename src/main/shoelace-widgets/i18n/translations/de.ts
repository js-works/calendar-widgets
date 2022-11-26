import { registerTranslation } from '@shoelace-style/localize';
import { Translations } from '../i18n';

const translations: Translations = {
  '$code': 'de',
  '$name': 'Deutsch',
  '$dir': 'ltr',

  'shoelaceWidgets.dialogs/cancel': 'Abbrechen',
  'shoelaceWidgets.dialogs/ok': 'OK',
  'shoelaceWidgets.dialogs/titleApprove': 'Zustimmung',
  'shoelaceWidgets.dialogs/titleConfirm': 'Bestätigung',
  'shoelaceWidgets.dialogs/titleError': 'Fehler',
  'shoelaceWidgets.dialogs/titleInfo': 'Information',
  'shoelaceWidgets.dialogs/titleInput': 'Eingabe',
  'shoelaceWidgets.dialogs/titleSuccess': 'Information',
  'shoelaceWidgets.dialogs/titleWarn': 'Abbrechen'
};

registerTranslation(translations);
