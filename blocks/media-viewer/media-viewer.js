import { moveInstrumentation } from '../../scripts/scripts.js';
import './media-viewer-component.js';

export default function decorate(block) {
  const items = [...block.children];
  if (items.length === 0) return;

  const viewer = document.createElement('media-viewer');
  moveInstrumentation(block, viewer);

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    const wrapper = document.createElement('span');
    moveInstrumentation(item, wrapper);
    wrapper.append(img);
    viewer.append(wrapper);
  });

  block.replaceChildren(viewer);
}
