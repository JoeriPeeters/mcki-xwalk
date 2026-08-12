import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  console.log('RAW BLOCK HTML:', block.outerHTML);
  await customElements.whenDefined('pggm-accordion');

  const accordion = document.createElement('pggm-accordion');
  moveInstrumentation(block, accordion);

  [...block.children].forEach((row) => {
    const [headerCell, contentCell] = row.children;
    const headerText = headerCell?.querySelector('p')?.textContent?.trim()
      || headerCell?.textContent?.trim();

    const item = document.createElement('pggm-accordion-item');
    moveInstrumentation(row, item);

    const headerSpan = document.createElement('span');
    headerSpan.slot = 'header';
    headerSpan.textContent = headerText;
    item.append(headerSpan);

    if (contentCell) {
      item.append(...contentCell.children);
    }

    accordion.append(item);
  });

  block.replaceChildren(accordion);
}
