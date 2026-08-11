class MediaViewer extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .viewer { position: relative; overflow: hidden; }
        ::slotted(img) { width: 100%; display: none; }
        ::slotted(img.active) { display: block; }
        .nav { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        button { cursor: pointer; }
      </style>
      <div class="viewer"><slot></slot></div>
      <div class="nav">
        <button id="prev">‹</button>
        <button id="next">›</button>
      </div>
    `;

    this.images = [...this.querySelectorAll('img')];
    this.index = 0;
    this.images[0]?.classList.add('active');

    this.shadowRoot.getElementById('prev').addEventListener('click', () => this.show(this.index - 1));
    this.shadowRoot.getElementById('next').addEventListener('click', () => this.show(this.index + 1));
  }

  show(newIndex) {
    this.images[this.index].classList.remove('active');
    this.index = (newIndex + this.images.length) % this.images.length;
    this.images[this.index].classList.add('active');
  }
}

customElements.define('media-viewer', MediaViewer);
