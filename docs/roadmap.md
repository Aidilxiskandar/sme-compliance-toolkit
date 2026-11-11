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

## Phase 2: Policies and plans (Jan to Feb 2027)
- [ ] Template 3: plain-language policy set
- [ ] Template 4: PDPA checklist
- [ ] Template 5: incident response and breach notification one-pager
- **Deliverable:** policy pack an owner can adopt in an afternoon

## Phase 3: Measure (Mar to Apr 2027)
- [ ] Template 6: gap assessment with maturity scoring
- [ ] "Before" assessment of all five businesses, from the "owner says" view
- [ ] Check the assessment finds the planted gaps; improve the questions where it misses
- [ ] Apply low-cost fixes, then the "after" assessment
- **Deliverable:** scored before/after for five businesses, with costs

## Phase 4: Publish and apply (2027)
- [ ] Case study write-up (comparing the five businesses)
- [ ] Optional Bahasa Malaysia version
- [ ] Choose licence, make the repo public, LinkedIn post
- [ ] Trial with 1 to 2 other small businesses
