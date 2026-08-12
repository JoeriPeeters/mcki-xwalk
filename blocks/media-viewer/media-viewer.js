import { moveInstrumentation } from '../../scripts/scripts.js';
import './media-viewer-component.js';
import 'https://esm.sh/@github/relative-time-element';

export default function decorate(block) {
  const greeting = block.querySelector('p')?.textContent?.trim() || 'Hello Web component !';

  const viewer = document.createElement('media-viewer');
  viewer.dataset.greeting = greeting;
  moveInstrumentation(block, viewer);

  const timeEl = document.createElement('relative-time');
  timeEl.setAttribute('datetime', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString());
  viewer.append(timeEl);

  block.replaceChildren(viewer);
}
