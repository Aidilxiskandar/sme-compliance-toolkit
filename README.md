# SME Compliance Toolkit

A free, practical **security and data-protection starter kit for Malaysian small businesses** such as cafes, shops and small offices. It is built around NIST CSF 2.0, mapped to ISO/IEC 27001:2022 Annex A and CIS Controls v8.1 (IG1), and covers the Personal Data Protection Act 2010 (PDPA) as amended in 2024.

> Status: 🚧 Phase 0. The plan and repo are set up. See the [roadmap](docs/roadmap.md).

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
| 7 | Case study: a small cafe in Selangor, before and after | Markdown |

## Repository layout
```
toolkit/      the templates a business fills in
case-study/   the anonymised worked example (a small cafe)
docs/         roadmap, framework mapping, decisions (adr/)
```

## Ground rules
- **Own words only.** ISO/IEC 27001 and CIS Controls text is not reproduced. Controls are cited by number, and every template is original writing.
- **Anonymised case study.** The worked example does not name the business or publish details an attacker could use.
- **Public sources only.** The kit draws on public frameworks, legislation and the author's own business.
