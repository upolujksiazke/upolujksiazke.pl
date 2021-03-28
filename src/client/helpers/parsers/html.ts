import {isWordCharacter} from './text';

/**
 * Splits HTML into two pars after certain length
 *
 * @export
 * @param {number} len
 * @param {string} text
 * @param {boolean} breakWord
 * @returns {string[]}
 */
export function splitHTMLAt(
  len: number,
  text: string,
  breakWord?: string,
): [string, string] {
  if (!text)
    return [text, null];

  let nesting = 0, textCharacters = 0;

  for (let i = 0; i < text.length; ++i, ++textCharacters) {
    const c = text[i];

    if (c === '<') {
      nesting += (
        text[i + 1] === '/'
          ? -1
          : 1
      );

      for (; i < text.length && text[i] !== '>'; ++i);
      continue;
    }

    if (textCharacters > len && !nesting && (breakWord || !isWordCharacter(c))) {
      return [
        text.substr(0, i),
        text.substr(i),
      ];
    }
  }

  return [text, null];
}

/**
 * Get HTML text between tags
 *
 * @export
 * @param {string} text
 * @returns
 */
export function getHTMLInnerText(text: string) {
  if (!text)
    return '';

  let acc = '';
  for (let i = 0; i < text.length; ++i) {
    const c = text[i];

    if (c === '<') {
      for (; i < text.length && text[i] !== '>'; ++i);
      continue;
    } else
      acc += c;
  }

  return acc;
}

/**
 * Counts all characters in HTML
 *
 * @export
 * @param {string} text
 * @returns
 */
export function getHTMLTextLength(text: string) {
  return getHTMLInnerText(text).length;
}