import { moveInstrumentation } from '../../scripts/scripts.js';
import htmlToElement from '../../scripts/dom-utils.js';

export default function decorate(block) {
  const [textRow, levelRow, sizeRow] = block.children;

  const text = textRow?.querySelector('p')?.textContent?.trim() || '';
  const level = levelRow?.textContent?.trim() || '2';
  const size = sizeRow?.textContent?.trim() || 'm';

  const heading = htmlToElement(`
    <h${level} is="pggm-heading-${level}" size="${size}">${text}</h${level}>
  `);

  moveInstrumentation(block, heading);
  block.replaceChildren(heading);
}
