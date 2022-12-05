import {
  registerIconLibrary,
  unregisterIconLibrary,
  IconLibrary
} from '@shoelace-style/shoelace/dist/components/icon/library';

import calendarRangeIcon from './bootstrap/calendar-range.icon';
import calendarIcon from './bootstrap/calendar.icon';
import calendarEventIcon from './bootstrap/calendar-event.icon';
import calendarMonthIcon from './bootstrap/calendar-month.icon';
import calendar3Icon from './bootstrap/calendar3.icon';
import checkCircleIcon from './bootstrap/check-circle.icon';
import checkLgIcon from './bootstrap/check-lg.icon';
import check2SquareIcon from './bootstrap/check2-square.icon';
import clockIcon from './bootstrap/clock.icon';
import clockHistoryIcon from './bootstrap/clock-history.icon';
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
import telephoneIcon from './bootstrap/telephone.icon';
import calendarWeekIcon from './bootstrap/calendar-week.icon';

import dateIcon from './custom/date.icon';
import timeRangeIcon from './custom/time-range.icon';
import weekIcon from './custom/week.icon';
import weekRangeIcon from './custom/week-range.icon';
import yearRangeIcon from './custom/year-range.icon';
import monthRangeIcon from './custom/month-range.icon';
import quarterIcon from './custom/quarter.icon';
import quarterRangeIcon from './custom/quarter-range.icon';

const icons = {
  'text-field.email': emailIcon,
  'text-field.phone': telephoneIcon,
  'text-field.cellphone': phoneIcon,

  'date-field.date': dateIcon,
  'date-field.date-time': calendarEventIcon,
  'date-field.date-range': calendarRangeIcon,
  'date-field.date-time-range': calendarWeekIcon,
  'date-field.time': clockIcon,
  'date-field.time-range': timeRangeIcon,
  'date-field.week': weekIcon,
  'date-field.week-range': weekRangeIcon,
  'date-field.month': calendarMonthIcon,
  'date-field.month-range': monthRangeIcon,
  'date-field.quarter': quarterIcon,
  'date-field.quarter-range': quarterRangeIcon,
  'date-field.year': calendarIcon,
  'date-field.year-range': yearRangeIcon,

  'dialogs.info': infoCircleIcon,
  'dialogs.success': check2SquareIcon,
  'dialogs.warn': exclamationDiamondIcon,
  'dialogs.error': exclamationTriangleIcon,
  'dialogs.prompt': keyboardIcon,
  'dialogs.confirm': questionDiamondIcon,
  'dialogs.approve': questionDiamondIcon,

  'toasts.info': infoCircleIcon,
  'toasts.success': checkCircleIcon,
  'toasts.warn': exclamationCircleIcon,
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
