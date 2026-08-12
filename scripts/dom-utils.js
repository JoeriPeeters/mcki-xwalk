/**
 * Zet een HTML-string om naar een DOM-element.
 * Gebruik: const el = htmlToElement(`<div class="foo">${text}</div>`);
 * @param {string} html
 * @returns {Element}
 */
export function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim(); // de browser parst de string naar DOM
  return template.content.firstElementChild;
}
