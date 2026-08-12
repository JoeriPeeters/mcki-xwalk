export default async function decorate(block) {
  console.log('BLOCK PARENT SECTION:', block.closest('.section')?.outerHTML);

  const accordion = document.createElement('pggm-accordion');
  moveInstrumentation(block, accordion);

  [...block.children].forEach((row) => {
    const item = document.createElement('pggm-accordion-item');
    moveInstrumentation(row, item);

    const cells = [...row.children];
    const [headerCell, contentCell, openCell, disabledCell] = cells;

    const headerText = headerCell?.querySelector('p')?.textContent?.trim()
      || headerCell?.textContent?.trim();
    const headerSpan = document.createElement('span');
    headerSpan.slot = 'header';
    headerSpan.textContent = headerText;
    item.append(headerSpan);

    if (contentCell) {
      item.append(...contentCell.children);
    }

    const isOpen = openCell?.textContent?.trim().toLowerCase() === 'true';
    const isDisabled = disabledCell?.textContent?.trim().toLowerCase() === 'true';
    if (isOpen) item.setAttribute('open', 'true');
    if (isDisabled) item.setAttribute('disabled', 'true');

    accordion.append(item);
  });

  block.replaceChildren(accordion);
}
