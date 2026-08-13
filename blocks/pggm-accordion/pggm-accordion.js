import { moveInstrumentation } from "../../scripts/scripts.js";
import htmlToElement from "../../scripts/dom-utils.js";
function decorate(block) {
  const items = [...block.children].map((row) => {
    const cells = [...row.children];
    const [headerCell, contentCell, openCell, disabledCell] = cells;
    const headerText = headerCell?.querySelector("p")?.textContent?.trim() || "";
    const isOpen = openCell?.textContent?.trim().toLowerCase() === "true";
    const isDisabled = disabledCell?.textContent?.trim().toLowerCase() === "true";
    const item = htmlToElement(`
      <pggm-accordion-item ${isDisabled ? 'disabled="true"' : ""} ${isOpen ? 'open="true"' : ""}>
        <span slot="header">${headerText}</span>
        <p>${contentCell?.textContent?.trim() || ""}</p>
      </pggm-accordion-item>
    `);
    moveInstrumentation(row, item);
    return item;
  });
  const accordion = htmlToElement("<pggm-accordion></pggm-accordion>");
  moveInstrumentation(block, accordion);
  accordion.append(...items);
  block.replaceChildren(accordion);
}
export {
  decorate as default
};
//# sourceMappingURL=pggm-accordion.js.map
