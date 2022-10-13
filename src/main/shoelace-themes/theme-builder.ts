import { defaultTheme } from './default-theme';
import type { Theme } from './themes';
import { ThemeModifiers } from './theme-modifiers';

// === exports =======================================================

export { ThemeBuilder };

// === types =========================================================

namespace ThemeBuilder {
  export type Modifier = (theme: Theme) => Partial<Theme>;
}

class ThemeBuilder {
  static readonly defaultTheme = defaultTheme;
  #baseTheme: Theme;
  #modifiers: ThemeBuilder.Modifier[] = [];

  constructor(baseTheme?: Theme) {
    this.#baseTheme = baseTheme || defaultTheme;
  }

  modify(...modifiers: ThemeBuilder.Modifier[]) {
    this.#modifiers.push(...modifiers);
  }

  build(): Theme {
    const tokens = { ...this.#baseTheme };

    this.#modifiers.forEach((modifier) =>
      Object.assign(tokens, modifier(tokens))
    );

    return Object.freeze(tokens);
  }
}
