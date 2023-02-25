import { registerTranslation } from '@shoelace-style/localize';
import { Translations } from '../i18n';

const translations: Translations = {
  '$code': 'en',
  '$name': 'English',
  '$dir': 'ltr',

  'shoelaceElements.dialogs/cancel': 'Cancel',
  'shoelaceElements.dialogs/ok': 'OK',
  'shoelaceElements.dialogs/titleApprove': 'Approval',
  'shoelaceElements.dialogs/titleConfirm': 'Confirmation',
  'shoelaceElements.dialogs/titleError': 'Error',
  'shoelaceElements.dialogs/titleInfo': 'Information',
  'shoelaceElements.dialogs/titleInput': 'Input',
  'shoelaceElements.dialogs/titlePrompt': 'Input',
  'shoelaceElements.dialogs/titleSuccess': 'Information',
  'shoelaceElements.dialogs/titleWarn': 'Cancel'
};

registerTranslation(translations);
