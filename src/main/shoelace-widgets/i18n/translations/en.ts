import { registerTranslation } from '@shoelace-style/localize';
import { Translations } from '../i18n';

const translations: Translations = {
  '$code': 'en',
  '$name': 'English',
  '$dir': 'ltr',

  'shoelaceWidgets.dialogs/cancel': 'Cancel',
  'shoelaceWidgets.dialogs/ok': 'OK',
  'shoelaceWidgets.dialogs/titleApprove': 'Approval',
  'shoelaceWidgets.dialogs/titleConfirm': 'Confirmation',
  'shoelaceWidgets.dialogs/titleError': 'Error',
  'shoelaceWidgets.dialogs/titleInfo': 'Information',
  'shoelaceWidgets.dialogs/titleInput': 'Input',
  'shoelaceWidgets.dialogs/titlePrompt': 'Input',
  'shoelaceWidgets.dialogs/titleSuccess': 'Information',
  'shoelaceWidgets.dialogs/titleWarn': 'Cancel'
};

registerTranslation(translations);
