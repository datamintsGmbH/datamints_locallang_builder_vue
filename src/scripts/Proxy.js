import * as utility from './Utility.js'

const standalonePath = function (ident) {
  return '/' + ident.replace(/-/g, '/') + '.json';
}

export let apiPath = function (ident, apiArguments = []) {
  const STANDALONE = false;
  const baseStyles = [
    "color: #fff",
    "background-color: #631982",
    "padding: 2px 4px",
    "border-radius: 2px"
  ].join(';');

  let path = '';
  if (STANDALONE) {
    path = standalonePath(ident);
  } else {
    path = utility.metaAttribute(ident)
    if (!path) {
      path = standalonePath(ident);
      console.warn(`Missing TYPO3 API path for "${ident}". Falling back to standalone path "${path}".`);
    }
  }
  if (apiArguments.length > 0) {
    path = utility.replaceVariables(path, apiArguments);
  }

  console.info(`%cProxy calling: %c${path}`, 'font-weight:bold', baseStyles);
  return path;
}
