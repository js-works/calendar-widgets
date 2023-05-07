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

  :host {
    /* Form control validity */
    --sl-input-valid-border-color: var(--sl-input-border-color);
    --sl-input-valid-border-color-hover: var(--sl-input-border-color-hover);
    --sl-input-valid-border-color-focus: var(--sl-input-border-color-focus);
    --sl-input-valid-focus-ring-color: var(--sl-input-focus-ring-color);
    --sl-input-valid-filled-border-width: 0;

    --sl-input-invalid-border-color: var(--sl-color-danger-600);
    --sl-input-invalid-border-color-hover: var(--sl-color-danger-700);
    --sl-input-invalid-border-color-focus: var(--sl-color-danger-800);
    --sl-input-invalid-focus-ring-color: var(--sl-color-danger-300);
    --sl-input-invalid-filled-border-width: var(--sl-input-border-width);
  }

  :host::after {
    content: '\u{1f809} ' attr(data-error);
    padding: 0.125em 0.325em;
    margin: 0px 0 4px 0;
    display: block;
    font-size: calc(100% - 2px);
    color: var(--sl-color-danger-800);
    background-color: var(--sl-color-danger-50);
    border: 1px solid var(--sl-color-danger-100);
    border-radius: 1px;
    box-sizing: border-box;
    max-height: 100px;
    transition: max-height 0.2s ease-out;
    overflow: hidden;
  }

  :host::after::first-line {
    background-color: red;
    border: 10px solid green;
  }
  
  :host::after::text() {
    border: 2px solid blue;
  }
  
  :host(:not([data-error]))::after {
    max-height: 0;
  }

  /* Validity */
  :host(sl-input[data-user-valid]) .input {
    border-color: var(--sl-input-valid-border-color);
  }
  :host(sl-input[data-user-valid]) .input:hover {
    border-color: var(--sl-input-valid-border-color-hover);
  }
  :host(sl-input[data-user-valid]) .input:focus-within {
    border-color: var(--sl-input-valid-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-valid-focus-ring-color);
  }
  :host(sl-input[data-user-invalid]) .input {
    border-color: var(--sl-input-invalid-border-color);
  }
  :host(sl-input[data-user-invalid]) .input:hover {
    border-color: var(--sl-input-invalid-border-color-hover);
  }

  :host(sl-input[data-user-invalid]) .input:focus-within {
    border-color: var(--sl-input-invalid-border-color);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-invalid-focus-ring-color);
  }
  :host(sl-input[data-user-valid]) .input--filled {
    border: solid var(--sl-input-valid-filled-border-width) var(--sl-input-valid-border-color);
    outline: none;
  }
  :host(sl-input[data-user-invalid]) .input--filled {
    border: solid var(--sl-input-invalid-filled-border-width) var(--sl-input-invalid-border-color);
    outline: none;
  }
`);
