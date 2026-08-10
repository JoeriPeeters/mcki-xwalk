import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    const body = document.createElement('div');
    body.className = 'cards-card-body';

    [...li.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture')) {
        // image cell
        cell.className = 'cards-card-image';
      } else if (cell.querySelector('a')) {
        // CTA cell: promote the anchor to a styled button
        const link = cell.querySelector('a');
        link.className = 'button';
        const p = document.createElement('p');
        p.className = 'button-container';
        p.append(link);
        cell.replaceWith(p);
        body.append(p);
      } else {
        // first non-empty text cell becomes the title, rest is copy
        const hasTitle = body.querySelector('h3');
        if (!hasTitle && cell.textContent.trim()) {
          const h3 = document.createElement('h3');
          moveInstrumentation(cell, h3);
          // lift inline content out of a wrapping <p> so we don't nest <p> in <h3>
          const source = cell.children.length === 1 && cell.firstElementChild.tagName === 'P'
            ? cell.firstElementChild
            : cell;
          h3.append(...source.childNodes);
          cell.remove();
          body.append(h3);
        } else {
          body.append(cell);
        }
      }
    });

    if (body.children.length) li.append(body);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
