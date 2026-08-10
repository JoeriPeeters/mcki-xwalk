import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // cells map positionally to the card model fields: image, title, text, CTA
    const [imageCell, titleCell, textCell, ctaCell] = [...row.children];

    // --- image ---
    if (imageCell) {
      imageCell.className = 'cards-card-image';
      // some sources deliver the image reference as a link to the asset
      const assetLink = imageCell.querySelector('a');
      if (assetLink && !imageCell.querySelector('picture, img')) {
        const img = document.createElement('img');
        img.src = assetLink.href;
        img.alt = '';
        moveInstrumentation(assetLink, img);
        assetLink.replaceWith(img);
      }
      li.append(imageCell);
    }

    const body = document.createElement('div');
    body.className = 'cards-card-body';

    // --- title ---
    if (titleCell && titleCell.textContent.trim()) {
      const h3 = document.createElement('h3');
      moveInstrumentation(titleCell, h3);
      // lift inline content out of a wrapping <p> so we don't nest <p> in <h3>
      const source = titleCell.children.length === 1 && titleCell.firstElementChild.tagName === 'P'
        ? titleCell.firstElementChild
        : titleCell;
      h3.append(...source.childNodes);
      body.append(h3);
    }

    // --- text ---
    if (textCell && textCell.textContent.trim()) {
      body.append(textCell);
    }

    // --- CTA ---
    const link = ctaCell?.querySelector('a');
    if (link) {
      link.className = 'button';
      const p = document.createElement('p');
      p.className = 'button-container';
      p.append(link);
      body.append(p);
    }

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
