# Local Development on Edge Delivery Services (xwalk)

A practical guide to how local development works for this project, why there is
no local AEM in the daily loop, and how to test blocks — both their rendering
and (when needed) the Universal Editor authoring experience.

> **Project context:** `mcki-xwalk` is an AEM Edge Delivery Services site using
> the **crosswalk (Universal Editor / WYSIWYG)** authoring model, based on
> [`aem-boilerplate-xwalk`](https://github.com/adobe-rnd/aem-boilerplate-xwalk).
> Content is authored in a cloud AEM author instance and rendered by the Edge
> Delivery pipeline — **not** by AEM WCM/HTL.

---

## 1. Prerequisites

- **Node 20+** (Node 14 is EOL and will break the AEM CLI). This repo pins
  Node via `.nvmrc`.
- The AEM CLI, run via `npx @adobe/aem-cli` (no global install required).

```bash
nvm use            # picks up .nvmrc (Node 20)
npm install
npx @adobe/aem-cli up --no-open --forward-browser-logs
# → http://localhost:3000/
```

---

## 2. The core mental model: the two-source split

`aem up` starts a **lightweight Node reverse proxy** — *not* a local AEM stack.
Every request to `localhost:3000` is split into two halves:

```
                    ┌─ code (blocks/, scripts/, styles/, *.js/.css)
  localhost:3000 ───┤    → served from your LOCAL working copy (even uncommitted)
                    │
                    └─ content (pages, authored block data, images)
                         → PROXIED to the remote preview pipeline
                           main--mcki-xwalk--JoeriPeeters.aem.page
```

- **Code** is always local — edit and see it instantly (auto-reload).
- **Content** is remote by default, pulled from whatever authors have
  **previewed**.

### Where the content actually comes from

```
http://localhost:3000/
        │  (aem up proxies content requests)
        ▼
https://main--mcki-xwalk--JoeriPeeters.aem.page/     ← EDS "preview" pipeline
        │
        ▼
https://author-p24103-e71623.adobeaemcloud.com
   /bin/franklin.delivery/JoeriPeeters/mcki-xwalk/main/index   ← cloud AEM author
        │
        ▼
   content an author created in Universal Editor and PREVIEWED
```

`.aem.page` = **preview** content (clicked "Preview"). `.aem.live` = **production**.

---

## 3. Do I need a local AEM? No.

There is **no local AEM instance** in the daily loop — no Quickstart jar, no
Java, no Docker. The only thing running on your machine is the AEM CLI proxy
(a Node process).

| Piece | Where it runs | Local? |
|---|---|---|
| AEM author (Universal Editor authoring) | `author-p24103-e71623.adobeaemcloud.com` (AEMaaCS) | ❌ |
| Edge Delivery pipeline (`.aem.page` / `.aem.live`) | Adobe edge | ❌ |
| AEM CLI proxy (`aem up`) | your laptop (Node) | ✅ |

This is the big shift from classic AEM: you do **not** run author/publish
locally (4502/4503). You need network access to the cloud pipeline, never a
local AEM install.

---

## 4. Testing a block: two different loops

Testing a block splits into two jobs that use different tooling. **~90% of
block development is Loop 1.**

| | **Loop 1: Block rendering** | **Loop 2: Authoring in UE** |
|---|---|---|
| What you test | Your `decorate()` JS + CSS | Author fields, properties panel, in-context editing |
| Tooling | `aem up` + browser | Universal Editor (cloud) + a content source |
| Needs author instance? | No | Yes |
| Speed | Instant reload | Slower |

---

## 5. Loop 1 — the `drafts/` folder (fast, offline, no author)

`drafts/` is a **local folder of static HTML files that stand in for authored
content**. It lets you develop blocks with no author instance at all.

```bash
npx @adobe/aem-cli up --html-folder drafts
# drafts/hello.html  →  http://localhost:3000/hello
```

With `--html-folder`, the CLI serves the **content** half from local files
instead of proxying. Code is still served from disk.

### What a draft file contains

You hand-write the **initial block markup** (the "contract" the author would
produce). In EDS a block is authored as a table: first cell = block name,
following rows/cells = content. Example for the `cards` block:

```html
<body>
  <main>
    <div>
      <div class="cards">
        <div>
          <div>Card one image</div>
          <div>Card one text</div>
        </div>
        <div>
          <div>Card two image</div>
          <div>Card two text</div>
        </div>
      </div>
    </div>
  </main>
</body>
```

- **`.html`** → full page markup (as above).
- **`.plain.html`** → just the `<main>` inner content, mirroring what the
  backend serves at `/path.plain.html`.

### Inspect the real contract

To make a draft faithful, copy the shape the real pipeline emits:

```bash
curl http://localhost:3000/somepage            # decorated HTML
curl http://localhost:3000/somepage.plain.html # raw block markup (the contract)
curl http://localhost:3000/somepage.md         # markdown source
```

### Why drafts are the right daily tool

- **Committed to git** → the team shares the same fixtures, reviewed in PRs.
- **Isolated & offline** → no shared-author contention, no login, no cloud dep.
- **Fast** → edit JS/CSS, refresh.

**The catch:** a draft is a **dead mock** — no `data-aue` instrumentation, no
properties panel, nothing to click-edit. It tests **rendering, not authoring**.

---

## 6. What a draft actually mimics (important nuance)

There are three distinct representations of the same content:

```
1. UE authoring data          2. Delivered markup            3. Decorated DOM
   (in the AEM repo/JCR)   →      (semantic HTML)         →     (final block)
   content fragments,           <div class="cards">            styled cards,
   node properties,      EDS       <div>…</div>       your JS   lazy images, etc.
   component models     pipeline  </div>             decorate
```

- Your block **never sees #1** (JCR data / content fragments / the UE model).
- Your block **only ever receives #2** — the semantic HTML. That is the contract.
- A `drafts/` file hand-writes **#2 directly**, skipping the repo and pipeline.

So you mimic the **delivered markup that authored content would produce**, not
the authored data itself. The block model (`_cards.json`) governs #1 and is on a
different plane — which is exactly why drafts can't test authoring.

---

## 7. Loop 2 — testing the block *inside* Universal Editor

UE makes a page editable by reading `data-aue-*` **instrumentation** injected by
the AEM author, and by saving edits back to a content backend. There are two
ways to get a UE loop.

### Option A — Cloud UE, canvas pointed at localhost (standard xwalk)

Real content + instrumentation come from the **cloud author**; block JS/CSS come
from your **localhost**.

1. Register the model: create `_myblock.json`, run `npm run build:json`, and
   **push the branch** so code sync deploys the models.
2. The block must be used on an authored page in the cloud author.
3. Point Universal Editor's canvas at your local server:
   ```
   https://experience.adobe.com/?devMode=true#/aem/editor/canvas/localhost:3000/<path>
   ```

> Caveat: the page delivered to localhost must carry instrumentation — i.e. the
> proxy must serve from the **author** delivery, not the plain `.aem.page`
> preview (which carries none).

### Option B — Fully local: local AEM SDK + local UES (heavy, isolated)

You *can* run everything locally: a local AEM SDK (Quickstart jar) as the
repository, plus a **local Universal Editor Service (UES)**, with `aem up`
proxying content from the local jar and UE pointed at localhost. This gives an
**isolated, offline** loop that tests both rendering **and** UE authoring.

Trade-offs:

| | Local SDK + local UES | AEM CLI + committed drafts |
|---|---|---|
| Tests block rendering | ✅ | ✅ |
| Tests UE authoring | ✅ (with restrictions) | ❌ |
| Per-engineer isolation | ✅ full | ✅ code; author shared |
| Offline | ✅ | ✅ (with drafts) |
| Weight | ❌ multi-GB jar, minutes to boot | ✅ one Node process |
| Restrictions | ⚠️ limited local asset access; UES feature subset | — |
| Content shareable | ❌ local JCR is throwaway | n/a (drafts are git-shared) |
| Adobe-documented as required? | ❌ "not required" for EDS | ✅ recommended loop |

**Use it for:** occasional UE/model validation in isolation without touching the
shared cloud author. **Don't use it for:** the daily inner loop (too heavy).

---

## 8. Team topology (5 developers)

Don't build the daily workflow on the shared cloud author — it's a single,
stateful, gated resource. Instead:

1. **Daily block dev** → AEM CLI + committed `drafts/` (light, fast, isolated,
   offline). This is where most work happens.
2. **Occasional UE/model validation** → either cloud UE pointed at localhost, or
   local SDK + UES for full isolation.
3. **Shared review / real content** → branch previews
   (`{branch}--mcki-xwalk--JoeriPeeters.aem.page`) against the cloud author.

Because the cloud author is the one contended resource, agree on **content
conventions**: a scratch/sandbox content folder for dev test pages, kept out of
production, so nobody experiments on real pages.

---

## 9. Environment URL reference

- **Local dev:** `http://localhost:3000/`
- **Production preview:** `https://main--mcki-xwalk--JoeriPeeters.aem.page/`
- **Production live:** `https://main--mcki-xwalk--JoeriPeeters.aem.live/`
- **Feature preview:** `https://{branch}--mcki-xwalk--JoeriPeeters.aem.page/`
- **Cloud author (AEMaaCS):** `https://author-p24103-e71623.adobeaemcloud.com/`
  (program `p24103`, environment `e71623`; gated behind Adobe IMS login)
