import { AbstractDialogCtrl } from '../../shared/dialogs';
import { Dialogs } from '../components/dialogs/dialogs';

export class DialogsCtrl extends AbstractDialogCtrl {
  static {
    // just to make sure that component Dialogs will never
    // be wrongly tree shaken
    void Dialogs;
  }

  constructor(parent: HTMLElement | (() => HTMLElement)) {
    super(parent, 'sw-dialogs');
  }
}
