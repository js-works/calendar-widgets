import baseStyles from './base-styles';

export function loadBaseStyles() {
  const styleElem = document.createElement('style');
  styleElem.textContent = baseStyles;
  document.head.append(styleElem);
  alert(1);
}
