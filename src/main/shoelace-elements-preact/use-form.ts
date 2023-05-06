export { useForm };

function useForm() {
  return fld;
}

const fld: Record<string, Record<string, unknown>> = new Proxy(
  {},
  {
    get(target: unknown, key: string) {
      let cleanup: (() => void) | null = null;

      return {
        name: key,

        ref: (el: HTMLElement) => {
          if (el) {
            setTimeout(() => {
              const shadowRoot =
                el instanceof HTMLElement ? el?.shadowRoot : null;

              if (!shadowRoot) {
                return;
              }

              shadowRoot.adoptedStyleSheets = [
                ...shadowRoot.adoptedStyleSheets,
                customStyleSheet
              ];

              const updateErrorMsg = () => {
                let message = (el as any).validationMessage;

                if (!message) {
                  el.removeAttribute('data-error');
                } else {
                  el.setAttribute('data-error', message);
                }
              };

              el.addEventListener('sl-input', (ev: any) => {
                const target = ev.target;

                if (target !== el) {
                  return;
                }

                updateErrorMsg();
              });

              updateErrorMsg();

              el.addEventListener('sl-invalid', (ev: any) => {
                el.setAttribute('data-error', (el as any).validationMessage);
                ev.preventDefault();
              });

              cleanup = () => {
                shadowRoot.adoptedStyleSheets =
                  shadowRoot.adoptedStyleSheets.filter(
                    (it) => it !== customStyleSheet
                  );
              };
            });
          } else {
            if (cleanup) {
              cleanup();
              cleanup = null;
            }
          }
        }
      };
    }
  }
) as any;

const customStyleSheet = new CSSStyleSheet();

customStyleSheet.replace(/*css*/ `
  :host([data-invalid][data-error])::after {
    content: '\u{1f809} ' attr(data-error);
    padding: 0.125em 0.325em;
    margin: 1px 0 4px 0;
    display: block;
    font-size: calc(100% - 2px);
    color: var(--sl-color-danger-800);
    background-color: var(--sl-color-danger-50);
    border: 1px solid var(--sl-color-danger-100);
    border-radius: 2px;
  }

  :host(sl-input)::part(base) {
    border: 1px solid var(--sl-color-danger-500);
  }
`);
