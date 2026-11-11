# Roadmap

Pace: about 4 to 5 hours a week.

## Phase 0: Plan and set up (done 10 Nov 2026)
- [x] Pick frameworks ([ADR 0001](adr/0001-nist-csf-backbone.md))
- [x] Set up repo, README, roadmap
- [x] Create five fictional case-study businesses ([ADR 0002](adr/0002-fictional-case-studies.md))

## Phase 1: Research and inventory (done 11 Nov 2026)
- [x] Read the NIST CSF 2.0 Small Business Quick-Start Guide ([notes](csf-small-business-notes.md))
- [x] Summarise PDPA 2010 + 2024 amendments from official sources ([pdpa-summary.md](pdpa-summary.md)); 5 open points flagged
- [x] Framework mapping: 32 toolkit controls ↔ CSF 2.0 ↔ ISO 27001:2022 ↔ CIS v8.1 IG1 (all 56 IG1 safeguards covered), checked against NIST's official mappings ([framework-mapping.md](framework-mapping.md))
- [x] Inventory (devices, accounts, personal data) built into the web app instead of a spreadsheet ([ADR 0003](adr/0003-browser-only-app.md))
- [x] Risk register with 5×5 scoring and heatmap, in the web app (CSV export available)
- [x] Filled in for the five case-study businesses (`data/examples/`, loaded in the app)
- **Deliverable:** mapping + web app with inventory, risk register and PDPA checks + five filled examples ✅

## Phase 2: Policies and plans (done 11 Nov 2026)
- [x] Template 3: six plain-language policies ([toolkit/policies/](../toolkit/policies/)), filled in by the app's Policies page
- [x] Template 4: PDPA checklist, 27 checks verified against the Act and JPDP guidelines ([toolkit/pdpa-checklist.md](../toolkit/pdpa-checklist.md)), interactive in the app with a score
- [x] Template 5: incident and breach plan ([toolkit/incident-breach-plan.md](../toolkit/incident-breach-plan.md)), generated per business in the app, plus a breach register page (DBN Guideline para 14)
- [x] Five example businesses filled in: checklist answers, contacts and breach-register entries
- **Deliverable:** policy pack an owner can adopt in an afternoon ✅

## Phase 3: Measure (done 11 Nov 2026)
- [x] Template 6: gap assessment, 32 questions with an *ask* and a *how to check* step, levels 0 to 3 ([data/assessment.json](../data/assessment.json)), in the app with scores by round, assurance gaps and inventory hints
- [x] "Before" assessment of all five businesses: self-assessment (owner says) and verified (evidence)
- [x] Coverage check of the question bank against the 40 planted gaps: 37/40 at first, 3 questions improved, now 40/40 (`tools/coverage.mjs`)
- [x] Action plan with rough costs for each business, then the "after" assessment
- **Deliverable:** scored before/after for five businesses, with costs ✅ ([phase3-results.md](phase3-results.md))

## Phase 4: Publish and apply (started 11 Nov 2026)
- [x] Case study write-up comparing the five businesses ([case-study.md](case-study.md))
- [ ] Optional Bahasa Malaysia version
- [x] Licence: MIT
- [ ] Full-history leak scan, make the repo public, publish the app on GitHub Pages
- [ ] LinkedIn post (later)
- [ ] Trial with 1 to 2 other small businesses
