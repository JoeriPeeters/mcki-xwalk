// ../src/blocks/typescript-card/typescript-card.ts
import { moveInstrumentation } from "../../scripts/scripts.js";
var FancyCard = class extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }
  get variant() {
    return this.getAttribute("variant") || "default";
  }
  set variant(value) {
    if (value) this.setAttribute("variant", value);
    else this.removeAttribute("variant");
  }
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; border-radius: 12px; padding: 1.5rem; border: 1px solid #e2e2e2; background: #fff; font-family: system-ui, sans-serif; }
      :host([variant="highlight"]) { border-color: #6a5acd; background: #f5f3ff; }
      :host([variant="warning"]) { border-color: #d97706; background: #fffbeb; }
      ::slotted(h2) { margin-top: 0; }
    `;
    shadow.append(style, document.createElement("slot"));
  }
};
if (!customElements.get("fancy-card")) {
  customElements.define("fancy-card", FancyCard);
}
function readModel(block) {
  const [titleRow, textRow, variantRow] = [...block.children];
  return {
    title: titleRow?.querySelector("p")?.textContent?.trim() || "",
    text: textRow?.innerHTML || "",
    variant: variantRow?.textContent?.trim().toLowerCase() || "default"
  };
}
function decorate(block) {
  const { title, text, variant } = readModel(block);
  const card = document.createElement("fancy-card");
  card.variant = variant;
  if (title) {
    const heading = document.createElement("h2");
    heading.textContent = title;
    card.append(heading);
  }
  if (text) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = text;
    card.append(...wrapper.children);
  }
  moveInstrumentation(block, card);
  block.replaceChildren(card);
}
export {
  decorate as default
};
//# sourceMappingURL=typescript-card.js.map
