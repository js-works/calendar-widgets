import { utilityStyles } from './default-theme';
import { defaultTheme } from './default-theme';

// === exports =======================================================

export { convertThemeToCss, customizeTheme, loadTheme };

// === exported types ================================================

type Theme = typeof defaultTheme;

// === local types ===================================================

type ThemeModifier = (theme: Theme) => Partial<Theme>;

// === exported functions ============================================

function customizeTheme(baseTheme: Theme, modifiers: ThemeModifier[]): Theme;
function customizeTheme(modifiers: ThemeModifier[]): Theme;
function customizeTheme(arg1: unknown, arg2?: unknown): Theme {
  const baseTheme = (arg2 ? arg1 : defaultTheme) as Theme;
  const modifiers = (arg2 ? arg2 : arg1) as ThemeModifier[];
  const tokens = { ...baseTheme };

  modifiers.forEach((modifier) => Object.assign(tokens, modifier(tokens)));
  return Object.freeze(tokens);
}

function convertThemeToCss(theme: Theme, selector: string) {
  const lines: string[] = [
    `${selector} {`,
    `  color-scheme: ${theme.light === 'inherit' ? 'light' : 'dark'};`
  ];

  Object.entries(theme).forEach(([key, value]) => {
    lines.push(`  --sl-${key}: ${value};`);
  });

  lines.push(`}\n\n\n${utilityStyles}`);
  return lines.join('\n');
}

function loadTheme(theme: Theme, selector: string): () => void {
  const elem = document.createElement('style');
  elem.append(document.createTextNode(convertThemeToCss(theme, selector)));
  document.head.append(elem);
  return () => elem.remove();
}
