import {
  registerIconLibrary,
  unregisterIconLibrary,
  IconLibrary
} from '@shoelace-style/shoelace/dist/components/icon/library';

import calendarRangeIcon from './bootstrap/calendar-range.icon';
import calendarIcon from './bootstrap/calendar.icon';
import calendar3Icon from './bootstrap/calendar3.icon';
import checkCircleIcon from './bootstrap/check-circle.icon';
import checkLgIcon from './bootstrap/check-lg.icon';
import check2SquareIcon from './bootstrap/check2-square.icon';
import clockIcon from './bootstrap/clock.icon';
import emailIcon from './bootstrap/email.icon';
import exclamationCircleIcon from './bootstrap/exclamation-circle.icon';
import exclamationDiamondIcon from './bootstrap/exclamation-diamond.icon';
import exclamationTriangleIcon from './bootstrap/exclamation-triangle.icon';
import infoCircleIcon from './bootstrap/info-circle.icon';
import infoLgIcon from './bootstrap/info-lg.icon';
import infoSquareIcon from './bootstrap/info-square.icon';
import inputCursorIcon from './bootstrap/input-cursor.icon';
import keyboardIcon from './bootstrap/keyboard.icon';
import layersIcon from './bootstrap/layers.icon';
import phoneIcon from './bootstrap/phone.icon';
import questionCircleIcon from './bootstrap/question-circle.icon';
import questionDiamondIcon from './bootstrap/question-diamond.icon';
import questionLgIcon from './bootstrap/question-lg.icon';
import telephoneIcon from './bootstrap/question-lg.icon';

const icons = {
  'dialogs.info': infoSquareIcon,
  'dialogs.success': check2SquareIcon,
  'dialogs.warning': exclamationDiamondIcon,
  'dialogs.error': exclamationTriangleIcon,
  'dialogs.prompt': keyboardIcon,
  'dialogs.confirmation': questionDiamondIcon,
  'dialogs.approval': questionDiamondIcon,

  'toasts.info': infoCircleIcon,
  'toasts.success': checkCircleIcon,
  'toasts.warning': exclamationCircleIcon,
  'toasts.error': exclamationTriangleIcon
};

const shoelaceWidgetsLibrary: IconLibrary = {
  name: 'shoelace-widgets',

  resolver: (name) => {
    if (Object.hasOwn(icons, name)) {
      return icons[name as keyof typeof icons];
    }

    return '';
  }
};

unregisterIconLibrary(shoelaceWidgetsLibrary.name);

registerIconLibrary(shoelaceWidgetsLibrary.name, {
  resolver: shoelaceWidgetsLibrary.resolver
});
