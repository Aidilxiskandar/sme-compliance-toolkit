# SME Security Kit (web app)

A browser-only app for the toolkit: list devices, online accounts and personal data, keep a risk register, and see which PDPA duties apply and what to fix first. See [ADR 0003](../docs/adr/0003-browser-only-app.md) for the design and security decisions.

## Run it locally
ES modules need to be served over http (opening `index.html` as a file won't work). From the **repository root**:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open http://127.0.0.1:8000/ (it forwards to `/app/`). Keep `--bind 127.0.0.1`: without it the server listens on every network interface, so anyone on the same Wi-Fi could browse the whole folder, including `.git`. Example links: `#/example/01` to `#/example/05` load the five fictional businesses.

## Tests
```sh
npm test        # runs node --test on tests/*.test.mjs, no packages to install
```

## Layout
| File | What it does |
|---|---|
| `index.html` | Page shell with a strict Content Security Policy |
| `js/model.js` | Field definitions for every table, and validation of imported files |
| `js/pdpa.js` | PDPA checks (registration, DPO, breach notification) and quick findings |
| `js/risk.js` | 5×5 risk scoring |
| `js/store.js` | Storage adapter (browser storage now, a server later) |
| `js/export.js` | JSON and CSV export (with formula-injection protection) |
| `js/dom.js` | Safe DOM builder: data becomes text, never HTML |
| `js/checklist.js` | Which PDPA checklist items apply, and the score |
| `js/assess.js` | Gap assessment scoring, assurance gaps, planted-gap found/closed rules, cost totals |
| `js/md.js` | Safe Markdown renderer for the toolkit templates (builds DOM nodes, no HTML parsing) |
| `js/views/` | Dashboard, table editor, profile, controls, start, policies, checklist and breach plan pages |

## Security notes
- No third-party code, no build step, no network calls except the app's own files.
- Imported files are size-limited (2 MB), parsed as JSON and validated field by field. Unknown fields are dropped, and unknown answers become "Don't know", never "Yes".
- CSV exports prefix cells starting with `= + - @` so spreadsheets don't run them as formulas.
