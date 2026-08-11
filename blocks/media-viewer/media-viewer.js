import { moveInstrumentation } from '../../scripts/scripts.js';
import './media-viewer-component.js';

export default function decorate(block) {
  const items = [...block.children]; // elke child = 1 media-viewer-image item

  const viewer = document.createElement('media-viewer');

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    const wrapper = document.createElement('span');
    moveInstrumentation(item, wrapper); // UE-tracking van het item-niveau overnemen
    wrapper.append(img);
    viewer.append(wrapper);
  });

  block.replaceChildren(viewer);
}