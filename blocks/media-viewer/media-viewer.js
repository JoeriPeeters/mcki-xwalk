import { moveInstrumentation } from '../../scripts/scripts.js';
import './media-viewer-component.js';

export default function decorate(block) {
  const items = [...block.children];
  if (items.length === 0) return;

  const viewer = document.createElement('media-viewer');

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    // img blijft child van het ORIGINELE, geïnstrumenteerde item
    // we verplaatsen niet de img zelf, maar linken 'm via slot
    viewer.append(img.cloneNode(true));
  });

  block.append(viewer);

  // originele items verbergen i.p.v. verwijderen — UE-instrumentatie blijft intact
  items.forEach((item) => {
    item.style.display = 'none';
  });
}
