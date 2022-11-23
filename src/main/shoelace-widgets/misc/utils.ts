export { nextFreeTagName };

function nextFreeTagName(baseName: string) {
  // TODO
  return baseName + '-' + Math.floor(Math.random() * 10000000);
}
