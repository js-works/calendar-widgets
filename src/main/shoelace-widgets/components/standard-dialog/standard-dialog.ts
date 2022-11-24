import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DialogConfig } from '../../controllers/abstract-dialogs-controller';

export { StandardDialog };

@customElement('sx-standard-dialog')
class StandardDialog extends LitElement {
  @property({ attribute: false })
  dialogConfig: DialogConfig | null = null;

  @property({ attribute: false })
  onDialogClosed: ((result: unknown) => void) | null = null;

  render() {
    return html`[DynamicDialog(${this.dialogConfig?.type})]`;
  }
}
