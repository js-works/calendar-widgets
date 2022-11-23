export { generateUniqueTagName };

function generateUniqueTagName(baseName: string) {
  // TODO
  return baseName + '-' + Math.floor(Math.random() * 10000000);
}
