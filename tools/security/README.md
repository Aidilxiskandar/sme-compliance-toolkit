# Security test harness

Drives headless Chrome through the DevTools Protocol (Node's built-in WebSocket, no packages). Results and findings are in [docs/security-testing.md](../../docs/security-testing.md).

Serve the app first, from the repo root: `python3 -m http.server 8765 --bind 127.0.0.1`

| Script | What it tests |
|---|---|
| `xss.mjs` | Plants a business with XSS payloads in every text field, visits all 14 pages, checks for script execution, injected elements, `on*` attributes, unsafe links, dialogs, exceptions and CSP violations |
| `attacks.mjs <dir>` | CSP as a second layer (forced injection), malformed URL hashes, hostile import files through the real file input (make them with `python3 make-fuzz-files.py <dir>`), storage full |
| `retest.mjs` | Regression checks for the fixed findings (malformed hashes, example links overwriting data, storage-full warning) |
| `framing-attacker.html` | Clickjacking check: serve it on another origin (`python3 -m http.server 8766` in this folder, open http://localhost:8766/framing-attacker.html) and see whether the app renders in the frame |

Test only your own local copy. Don't point these at sites you don't own.
