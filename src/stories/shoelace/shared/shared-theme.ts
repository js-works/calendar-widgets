import {
  customizeTheme,
  loadTheme,
  ColorSchemes,
  ThemeModifiers
} from '../../../main/shoelace-themes';

const sharedTheme = customizeTheme(
  ThemeModifiers.builder()
    //.colors(ColorSchemes.orchid)
    .modern()
    .compact()
    //.dark(true)
    .build()
);

loadTheme(sharedTheme, '#root,.sl-toast-stack');
