import { registerTranslation } from '@shoelace-style/localize';
import { Translations } from '../i18n';

const translations: Translations = {
  '$code': 'en',
  '$name': 'English',
  '$dir': 'ltr',

  'shoelaceWidgets.dialogs/approval': 'Approval',
  'shoelaceWidgets.dialogs/cancel': 'Cancel',
  'shoelaceWidgets.dialogs/confirmation': 'Confirmation',
  'shoelaceWidgets.dialogs/error': 'Error',
  'shoelaceWidgets.dialogs/information': 'Information',
  'shoelaceWidgets.dialogs/input': 'Input',
  'shoelaceWidgets.dialogs/ok': 'OK',
  'shoelaceWidgets.dialogs/warning': 'Cancel'
};

registerTranslation(translations);
