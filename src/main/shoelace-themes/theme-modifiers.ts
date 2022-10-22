import type { Theme } from './default-theme';
import { colorShades, paletteColors, semanticColors } from './default-theme';

// === exports =======================================================

export { ThemeModifiers };

// === local types ===================================================

export type ColorScheme = {
  primaryColor?: string;
  successColor?: string;
  warningColor?: string;
  dangerColor?: string;
  neutralColor?: string;
};

type Args<F extends Function> = F extends (...args: infer A) => unknown
  ? A
  : never;

type ModifierName = keyof typeof modifiers;

type ModifiersBuilder<M extends ModifierName = ModifierName> = {
  [K in M]: (
    ...args: Args<typeof modifiers[K]>
  ) => ModifiersBuilder<Exclude<M, K>>;
} & {
  build(): ((theme: Theme) => Partial<Theme>)[];
};

// === constants =====================================================

const colorLuminances = [
  0.95, // 50
  0.84, // 100
  0.73, // 200
  0.62, // 300
  0.49, // 400
  0.35, // 500
  0.23, // 600
  0.15, // 700
  0.1, // 800
  0.05, // 900
  0.02 // 950
];

// === theme modifiers ===============================================

const modifiers = {
  colors(colorScheme: ColorScheme) {
    return (theme: Theme): Partial<Theme> => {
      const ret: Partial<Theme> = {};
      const isDark = theme.light === ' ';

      for (const semanticColor of semanticColors) {
        const colorHex = colorScheme[`${semanticColor}Color`];

        if (colorHex) {
          Object.assign(ret, {
            ...calcColorShades(semanticColor, colorHex, isDark)
          });
        }
      }

      return ret;
    };
  },

  dark(veryDark: boolean = false) {
    return (tokens: Theme): Partial<Theme> => {
      if (tokens.dark === 'inherit') {
        throw new Error(
          'Colors cannot be inverted to dark mode as base theme is already dark'
        );
      }

      const darkTokens: Record<string, string> = Object.assign({}, tokens);

      [...semanticColors, ...paletteColors].forEach((color) => {
        if (tokens[`color-${color}-500`].includes('var(')) {
          return;
        }

        for (let i = 0; i < 5; ++i) {
          const key1 = `color-${color}-${i === 0 ? 50 : i * 100}`;
          const key2 = `color-${color}-${i === 0 ? 950 : 1000 - i * 100}`;

          darkTokens[key1] = (tokens as any)[key2];
          darkTokens[key2] = (tokens as any)[key1];
        }
      });

      if (!veryDark) {
        Object.assign(darkTokens, {
          //'color-neutral-0': 'rgb(58 67 77)',
          'color-neutral-0': 'rgb(52 52 52)',
          'color-neutral-50': 'rgb(65 75 86)',
          'color-neutral-100': 'rgb(93 93 97)',
          'color-neutral-200': 'rgb(103 103 106)',
          'color-neutral-300': 'rgb(117 117 114)',
          'color-neutral-400': 'rgb(120 120 124)',
          'color-neutral-500': 'rgb(128 128 127)',
          'color-neutral-600': 'rgb(166 166 175)',
          'color-neutral-700': 'rgb(217 217 221)',
          'color-neutral-800': 'rgb(233 233 236)',
          'color-neutral-900': 'rgb(249 249 250)',
          'color-neutral-950': 'rgb(252 252 253)',
          'color-neutral-1000': 'rgb(255 255 255)'
        });
      } else {
        Object.assign(darkTokens, {
          'color-neutral-0': 'rgb(30 30 33)',
          'color-neutral-50': 'rgb(36 36 39)',
          'color-neutral-100': 'rgb(40 40 43)',
          'color-neutral-200': 'rgb(43 43 46)',
          'color-neutral-300': 'rgb(67 67 74)',
          'color-neutral-400': 'rgb(86 86 95)',
          'color-neutral-500': 'rgb(118 118 127)',
          'color-neutral-600': 'rgb(166 166 175)',
          'color-neutral-700': 'rgb(217 217 221)',
          'color-neutral-800': 'rgb(233 233 236)',
          'color-neutral-900': 'rgb(249 249 250)',
          'color-neutral-950': 'rgb(252 252 253)',
          'color-neutral-1000': 'rgb(255 255 255)'
        });
      }

      Object.assign(darkTokens, {
        'shadow-x-small': '0 1px 2px rgb(0 0 0 / 18%)',
        'shadow-small': '0 1px 2px rgb(0 0 0 / 24%)',
        'shadow-medium': '0 2px 4px rgb(0 0 0 / 24%)',
        'shadow-large': '0 2px 8px rgb(0 0 0 / 24%)',
        'shadow-x-large': '0 4px 16px rgb(0 0 0 / 24%)',
        'focus-ring-alpha': '45%',
        'overlay-background-color': 'hsl(0 0% 0% / 43%)',
        'panel-background-color': 'var(--sl-color-neutral-50)'
      });

      return darkTokens;
    };
  },

  modern(veryProgressive = false) {
    return (tokens: Theme): Partial<Theme> => {
      let ret: Partial<Theme> = {
        'font-sans':
          "'Open Sans', -apple-system, BlinkMacSystemFont, 'Lato', 'Libre Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        'font-weight-semibold': '600',
        'border-radius-small': '0px',
        'border-radius-medium': '1px',
        'border-radius-large': '2px',
        'border-radius-x-large': '3px',

        'focus-ring-width': '1px',
        'input-focus-ring-color': 'var(--sl-color-primary-400)',

        'input-border-color': 'var(--sl-color-neutral-400)',
        'input-border-color-hover': 'var(--sl-color-neutral-600)',
        'input-border-color-focus': 'var(--sl-color-primary-700)',

        'overlay-background-color': 'hsl(0 0% 0% / 60%)'
      };

      if (veryProgressive) {
        // TODO!!!
        const additionalTokens: Partial<Theme> = {
          'input-background-color': 'rgb(238, 238, 238)',
          'input-border-color': 'rgb(230, 230, 230)'
        };

        Object.assign(ret, additionalTokens);
      }

      return ret;
    };
  },

  compact() {
    return (tokens: Theme): Partial<Theme> => {
      return {
        'font-size-medium': '0.92rem',
        'font-size-x-large': '1.5rem',
        'input-height-small': '1.85rem',
        'input-height-medium': '1.95rem',
        'input-height-large': '2.5rem'
      };
    };
  }
};

const ThemeModifiers = Object.freeze({
  ...modifiers,
  builder: (): ModifiersBuilder => {
    const allMethodNames = Object.keys(ThemeModifiers).filter(
      (it) => it !== 'builder'
    );

    const getBuilder = (
      usedMethodNames: string[],
      freeMethodNames: string[],
      modifiers: ((theme: Theme) => Partial<Theme>)[]
    ): Partial<ModifiersBuilder> => {
      const ret: any = {};

      for (const key of freeMethodNames) {
        ret[key] = (...args: unknown[]) => {
          const modifier = (ThemeModifiers as Record<string, Function>)[key](
            ...args
          );

          return getBuilder(
            usedMethodNames.concat(key),
            freeMethodNames.filter((it) => it !== 'key'),
            modifiers.concat(modifier)
          );
        };
      }

      ret.build = () => modifiers;
      return ret;
    };

    return getBuilder([], allMethodNames, []) as any;
  }
});

// === local helpers =================================================

function calcColorShades(
  colorName: string,
  colorHex: string,
  dark = false
): Record<`color-${string}-${string}`, string> {
  const ret: any = {};

  colorLuminances.forEach((luminance, idx) => {
    if (dark) {
      idx = 1000 - idx;
    }

    ret[`color-${colorName}-${colorShades[idx]}`] =
      'rgb(' + calcColor(colorHex, luminance).join(' ') + ')';
  });

  return ret;
}

// === color utility functions =======================================

function calcColor(hex: string, lum: number): [number, number, number] {
  let [r, g, b] = hexToRgb(hex);
  let iter = 0;
  let l = luminanceOfRgb(r, g, b);
  let rmin = 0;
  let gmin = 0;
  let bmin = 0;
  let rmax = 255;
  let gmax = 255;
  let bmax = 255;

  while (++iter <= 20 && Math.abs(l - lum) > 1e-7) {
    if (l < lum) {
      rmin = r;
      gmin = g;
      bmin = b;
    } else {
      rmax = r;
      gmax = g;
      bmax = b;
    }

    r = (rmin + rmax) / 2;
    g = (gmin + gmax) / 2;
    b = (bmin + bmax) / 2;
    l = luminanceOfRgb(r, g, b);
  }

  return [Math.round(r), Math.round(g), Math.round(b)];
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.substr(1), 16);

  if (isNaN(value) || hex[0] !== '#' || hex.length !== 7) {
    throw new Error(`Illegal color '${hex}'. Required hex format: #rrggbb`);
  }

  const r = (value >> 16) % 256;
  const g = (value >> 8) % 256;
  const b = value % 256;

  return [r, g, b];
}

function luminanceOfRgb(r: number, g: number, b: number): number {
  // relative luminance
  // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  const lr = luminanceOfValue(r);
  const lg = luminanceOfValue(g);
  const lb = luminanceOfValue(b);

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function luminanceOfValue(x: number): number {
  const v = x / 255;

  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
