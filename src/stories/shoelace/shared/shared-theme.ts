import {
  customizeTheme,
  loadTheme,
  ColorSchemes,
  ThemeModifiers
} from '../../../main/shoelace-themes';

const sharedTheme = customizeTheme([
  ThemeModifiers.colors(ColorSchemes.bostonBlue),
  ThemeModifiers.modern(),
  ThemeModifiers.compact()
  //ThemeModifiers.dark()
]);

loadTheme(sharedTheme, '#root');
