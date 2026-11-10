# ADR 0001: Use NIST CSF 2.0 as the backbone, mapped to ISO 27001 and CIS IG1

- Status: Accepted
- Date: 2026-11-10

## Context
The kit needs one structure that a small business owner can follow and that a client, auditor or bigger customer would recognise. It also must be publishable: the text of some frameworks is copyrighted or licensed with no derivatives allowed.

## Options considered
| Option | For | Against |
|---|---|---|
| ISO/IEC 27001:2022 alone | What auditors and larger clients ask for; matches the ISO 27001 Lead Implementer path | Paid standard, text cannot be reproduced; 93 Annex A controls are too many for a 5-person shop |
| CIS Controls v8.1 IG1 alone | Built for small organisations; concrete, technical safeguards | Licence (CC BY-NC-ND) forbids derivative works; light on governance and risk |
| **NIST CSF 2.0 backbone** | Free and public; plain language; has a Small Business Quick-Start Guide; the Govern function covers risk and policy | US-origin, not a certification |
| Malaysian national frameworks only | Local fit | Aimed at critical infrastructure and larger organisations, not micro-SMEs |

## Decision
Structure the kit on **NIST CSF 2.0** (Govern, Identify, Protect, Detect, Respond, Recover). Map each item to **ISO/IEC 27001:2022 Annex A control numbers** and **CIS Controls v8.1 IG1 safeguard numbers**, citing numbers only. Cover the **PDPA 2010 as amended in 2024** as the legal layer.

## Consequences
- Every template is written in original words; ISO and CIS are referenced by ID, never quoted.
- A business that uses the kit gets a head start on ISO 27001 without the kit claiming certification readiness.
- The mapping table (`docs/framework-mapping.md`) becomes the core reference and must be checked against the official documents.
