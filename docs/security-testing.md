# Security testing and hardening

- **Date:** 11 Nov 2026
- **Target:** the toolkit web app (`app/`) on a local copy, plus a read-only check of the live site's HTTP headers
- **Method:** code review, then active tests in headless Chrome driven over the DevTools Protocol (harness in [tools/security/](../tools/security/))

## Threat model
The app has no server, no accounts and no third-party code. Each business's data lives in the user's own browser. The realistic attacks are:
1. **A hostile import file** (sent by email or chat as a "template") that tries to run script, break the app or tamper with stored data.
2. **A crafted link** to the app (`…/app/#/…`).
3. **Another website framing the app** (clickjacking) while the visitor has data saved.
4. **Exports** opened in spreadsheet software (formula injection).
5. **Someone else using the same computer** (data stored unencrypted in the browser).
6. **The GitHub repository itself** (secrets pushed by mistake, history rewritten).

## Results
| # | Test | Result | Severity | Status |
|---|---|---|---|---|
| 1 | XSS payloads (`<img onerror>`, `<script>`, `<svg onload>`, `javascript:`, Markdown and template syntax) in every text field, rendered on all 14 pages | No execution, no injected elements, no `on*` attributes, no unsafe links, no dialogs or exceptions. Payloads show as plain text | – | ✅ Pass |
| 2 | CSP as a second layer: forced `innerHTML` injection, inline `<script>`, request to an external host | All three blocked by the Content Security Policy | – | ✅ Pass |
| 3 | Hostile imports: 3 MB file, broken JSON, 100,000-level nesting, 800 rows, wrong types | Rejected or capped with a clear message; no hang | – | ✅ Pass |
| 4 | Prototype pollution through import (`__proto__`, `constructor.prototype`, in the profile, checklist and assessment answers) | `Object.prototype` untouched; hostile keys dropped | – | ✅ Pass |
| 5 | CSV formula injection (`=HYPERLINK(…)`, `+`, `@`) | Neutralised with a leading `'` (unit tested) | – | ✅ Pass |
| 6 | **Clickjacking:** the app framed by a page on another origin | **The app rendered fully inside the frame**, with the visitor's saved data and working buttons (Delete, Open file). GitHub Pages can't send `X-Frame-Options` or `frame-ancestors`, and `frame-ancestors` is ignored in a `<meta>` CSP | Medium | ✅ Fixed |
| 7 | **Example links overwrite data:** opening `#/example/01` from any link silently replaced a saved, edited copy of that example | Integrity loss from a link that could come from anywhere (including a framing page) | Low–Medium | ✅ Fixed |
| 8 | **Malformed URL** (`#/controls/%E0%A4%A`) | Uncaught `URIError`; the page recovered on the next navigation | Low | ✅ Fixed |
| 9 | Wrong types in text fields (an object as the business name) | Stored as the text "[object Object]". Harmless, but untidy | Info | ✅ Fixed |
| 10 | Browser storage completely full | Warning shown ("changes only last until you close this tab"); app keeps working | – | ✅ Pass |
| 11 | Data at rest on a shared computer | Stored unencrypted in the browser, readable by anyone using the same browser profile | Low (by design) | ⚠️ Mitigated |
| 12 | Live site headers | HTTPS enforced (HTTP → 301), HSTS on. No `X-Frame-Options`, `X-Content-Type-Options` or CSP header (GitHub Pages doesn't allow custom headers) | Info | ⚠️ Accepted, see fix 6 |
| 13 | Repository settings | Secret scanning and push protection off; `main` not protected against force-push or deletion | Low | ✅ Fixed |
| 14 | Local dev server | `python3 -m http.server` without `--bind` listens on every interface, exposing the whole folder (including `.git`) to the local network | Low | ✅ Documented |

## Fixes
- **6 Clickjacking:** the app checks whether it is inside a frame (`window.top !== window.self`) before rendering anything. If so, it shows only a message and a link to open it directly, with no data and no buttons. Retested: the framed app shows the message.
- **7 Example links:** if the example is already saved, the app asks whether to reset it or open the saved copy. Retested: the prompt appears.
- **8 Malformed URLs:** each hash segment is decoded inside `try/catch` and the hash is capped at 300 characters. Retested: 0 exceptions.
- **9 Wrong types:** text fields accept only strings and numbers; anything else becomes empty. Unit test added.
- **11 Shared computers:** a "Clear all data from this browser" button and a shared-computer warning on the About page; the start page points to it. "Save file" now warns that the file lists the business's weaknesses and personal data details. Encrypting stored data with a passphrase is a possible later improvement.
- **13 Repository:** secret scanning and push protection turned on; `main` protected against force-pushes and deletion.
- **14 Dev server:** the README and app README use `--bind 127.0.0.1`.

## What stays true by design
- **No third-party code:** nothing to patch, no supply chain.
- **Text-only rendering:** user data only ever becomes text nodes (`app/js/dom.js`, `app/js/md.js`).
- **Strict CSP:** only the app's own scripts and styles, no inline script, no external connections.
- **Validated imports:** size limit, field-by-field validation, unknown keys dropped, "Don't know" instead of "Yes" for unknown answers.

## Limits
These tests cover the attacks above against a local copy. They are not a full penetration test, and they don't cover browser extensions or malware on the user's device, which can read anything the browser can.
