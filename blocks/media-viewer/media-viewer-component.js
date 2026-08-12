class MediaViewer extends HTMLElement {
  static get observedAttributes() {
    return ['greeting'];
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  render() {
    const greeting = this.getAttribute('greeting') || 'Hello Web component !';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; border: 2px dashed green; padding: 1rem; }
      </style>
      <p>${greeting}</p>
    `;
  }
}

customElements.define('media-viewer', MediaViewer);
