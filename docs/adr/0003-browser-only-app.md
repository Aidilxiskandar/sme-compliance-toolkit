# ADR 0003: Deliver the toolkit as a browser-only web app, built for a server later

- Status: Accepted
- Date: 2026-11-11

## Context
Small-business owners won't fill in wide spreadsheets. The toolkit needs guided input, automatic checks (PDPA duties, risk scores) and a clear summary. The data it holds (inventories, risks, weaknesses) is sensitive: a list of a business's security gaps is useful to an attacker.

## Options considered
| Option | For | Against |
|---|---|---|
| Spreadsheets only | Familiar, no code | No guidance, no automatic checks, easy to break |
| Full web app with server and logins now | Multi-client consultant workflow (MSSP angle) | We would hold many businesses' weaknesses; must secure, host and pay for it; much slower to build |
| **Browser-only app now, server later** | Data never leaves the owner's device, so there's nothing for us to leak; free static hosting (GitHub Pages); fast to build | No sharing between devices until the server version exists |

## Decision
Build a **static, browser-only app** in `app/`: plain HTML, CSS and JavaScript modules, with **no frameworks, no build step and no third-party packages**. Data is stored in the browser and in files the user exports. All reads and writes go through one storage module (`app/js/store.js`), so a server-backed store with accounts can replace it in Phase 4 without touching the views.

## Security design
- Strict Content Security Policy: only the app's own scripts and styles; no inline script, no external hosts, no plugins.
- User data is only ever inserted as text (`textContent`), never as HTML, so a crafted import file can't inject script (XSS).
- Every imported file is validated against the data model: unknown fields are dropped, types are forced, text and list sizes are capped.
- No analytics, no cookies, no network calls except loading the app's own reference data and example files.

## Consequences
- Zero dependency supply-chain risk; any reviewer can read all the code.
- Spreadsheets are still available as **exports** (CSV per table), along with JSON save/load and a printable report.
- Phase 4 (optional): add a server API + accounts behind the same store interface.
