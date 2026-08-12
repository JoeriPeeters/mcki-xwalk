/**
 * Zet een HTML-string om naar een DOM-element.
 * Gebruik: const el = htmlToElement(`<div class="foo">${text}</div>`);
 * @param {string} html
 * @returns {Element}
 */
export default function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
