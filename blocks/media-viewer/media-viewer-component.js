class MediaViewer extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; border: 2px dashed green; padding: 1rem; }
        ::slotted(img) { max-width: 200px; margin: 0.5rem; }
      </style>
      <p>Hello Web component !</p>
      <slot></slot>
    `;
  }
}

customElements.define('media-viewer', MediaViewer);
