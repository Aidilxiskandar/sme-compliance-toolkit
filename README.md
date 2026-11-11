# SME Compliance Toolkit

A free, practical **security and data-protection starter kit for Malaysian small businesses** such as cafes, shops and small offices. It is built around NIST CSF 2.0, mapped to ISO/IEC 27001:2022 Annex A and CIS Controls v8.1 (IG1), and covers the Personal Data Protection Act 2010 (PDPA) as amended in 2024.

> Status: 🚧 Phase 1. A working **web app** (`app/`) now holds the inventory, risk register and PDPA checks, with the five fictional businesses loaded as examples. Also done: the [PDPA summary](docs/pdpa-summary.md) checked against official JPDP sources, and the [framework mapping](docs/framework-mapping.md) of 32 controls. See the [roadmap](docs/roadmap.md).

> **Not legal advice.** This is a starter kit to help a small business get the basics right. For legal questions about the PDPA, check the official sources or ask a lawyer.

## Why
Most small businesses hold personal data (customer phone numbers, delivery addresses, CCTV, staff records) and run on a few laptops, a POS and shared Wi-Fi. Enterprise frameworks are too big for them, and the PDPA amendments added duties such as breach notification. This kit cuts the frameworks down to what a five-person business can actually do in a few weekends, with templates they can fill in.

## What's inside (planned)
| # | Item | Format |
|---|---|---|
| 1 | Asset and personal-data inventory | Spreadsheet |
| 2 | Risk register (5×5 likelihood × impact) | Spreadsheet |
| 3 | Plain-language policies (acceptable use, passwords and MFA, backups, access, data protection, clear desk) | Markdown |
| 4 | PDPA checklist (7 principles + 2024 amendments) | Markdown |
| 5 | One-page incident response and breach notification plan | Markdown |
| 6 | Gap assessment with a maturity score against CSF 2.0 | Spreadsheet |
| 7 | Case studies: [five fictional small businesses](case-study/), before and after | Markdown |

## The app
A browser-only web app: everything stays on the user's device, with no server or account. Run it with `python3 -m http.server` from the repo root and open `/app/`. See [app/README.md](app/README.md).

- **Inventory:** devices, online accounts and personal data sets.
- **Risk register:** 5×5 scoring and a heatmap.
- **PDPA duties:** worked out automatically (JPDP registration, DPO, what a breach would trigger), with sources.
- **Quick findings:** linked to the toolkit controls (no MFA, shared logins, default passwords, exposed devices).
- **Exports:** CSV, JSON save/load and a printable report.

## Repository layout
```
app/          the web app (no dependencies)
tests/        unit tests (node --test)
toolkit/      written templates (policies, plans) in Phase 2
case-study/   five fictional businesses used to test the kit
docs/         roadmap, PDPA summary, framework mapping, decisions (adr/)
data/         controls and NIST mapping data (JSON)
tools/        scripts that check the mapping and build the docs
```

## Ground rules
- **Own words only.** ISO/IEC 27001 and CIS Controls text is not reproduced. Controls are cited by number, and every template is original writing.
- **Fictional case studies.** The kit is tested on five invented businesses, so no real business's weaknesses are published ([ADR 0002](docs/adr/0002-fictional-case-studies.md)).
- **Public sources only.** The kit draws only on public frameworks and legislation.
