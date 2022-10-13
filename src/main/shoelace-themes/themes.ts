import type { defaultTheme } from './default-theme';

// === exports =======================================================

export { convertThemeToCss, loadTheme };
export type { Theme };

// === types =========================================================

type Theme = typeof defaultTheme;

// ===================================================================

function convertThemeToCss(theme: Theme, selector = ':root, :host') {
  const lines: string[] = [
    `${selector} {` //
  ];

  Object.entries(theme).forEach(([key, value]) => {
    lines.push(`  --sl-${key}: ${value};`);
  });

  lines.push('}\n');
  return lines.join('\n');
}

function loadTheme(theme: Theme, selector?: string): () => void {
  const elem = document.createElement('style');
  elem.append(document.createTextNode(convertThemeToCss(theme, selector)));
  document.head.append(elem);
  return () => elem.remove();
}
