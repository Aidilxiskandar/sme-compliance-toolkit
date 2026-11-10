# ADR 0002: Test the kit on five fictional businesses instead of a real one

- Status: Accepted
- Date: 2026-11-10

## Context
The kit needs worked examples to prove the templates and the gap assessment work. The first plan was one real, anonymised small business. But a public case study of a real business lists its weaknesses, and a "small cafe in a named state" may still be identifiable. One business also only exercises part of the kit.

## Options considered
| Option | For | Against |
|---|---|---|
| One real business, anonymised | Real data, credible | Publishes real weaknesses; may be identifiable; one industry only |
| Several real businesses | Variety, credible | Needs owners' consent and NDAs; same exposure risk; slow |
| **Five fictional businesses** | No real business is exposed; variety of industries and data types; we know the true state, so gaps can be planted and used as an answer key | Not real-world evidence; must be realistic, not cartoonish |

## Decision
Create five fictional Malaysian small businesses (cafe, GP clinic, online shop, accounting firm, tuition centre). Each profile has an **"owner says"** view (the assessment input) and an **"actually true"** view (planted gaps, the answer key). They are clearly labelled fictional and use `.example` domains.

## Consequences
- The gap assessment can be measured: a planted gap it misses means a question needs fixing.
- The kit covers ordinary, sensitive (health) and minors' personal data, and different risks (ransomware, BEC, account takeover).
- Realism must come from common, well-known SME failure patterns, not from any real organisation's documents.
- A real-world trial with a consenting business remains an optional Phase 4 step.
