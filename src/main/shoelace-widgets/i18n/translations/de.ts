import { registerTranslation } from '@shoelace-style/localize';
import { Translations } from '../i18n';

const translations: Translations = {
  '$code': 'de',
  '$name': 'Deutsch',
  '$dir': 'ltr',

  'shoelaceWidgets.dialogs/approval': 'Zustimmung',
  'shoelaceWidgets.dialogs/cancel': 'Abbrechen',
  'shoelaceWidgets.dialogs/confirmation': 'Bestätigung',
  'shoelaceWidgets.dialogs/error': 'Fehler',
  'shoelaceWidgets.dialogs/information': 'Information',
  'shoelaceWidgets.dialogs/input': 'Eingabe',
  'shoelaceWidgets.dialogs/ok': 'OK',
  'shoelaceWidgets.dialogs/warning': 'Abbrechen'
};

registerTranslation(translations);
