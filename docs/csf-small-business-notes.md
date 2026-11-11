# Notes: NIST CSF 2.0 Small Business Quick-Start Guide

Source: NIST SP 1300, *NIST Cybersecurity Framework 2.0: Small Business Quick-Start Guide*, February 2024 ([doi:10.6028/NIST.SP.1300](https://doi.org/10.6028/NIST.SP.1300)). NIST publications are U.S. government works and can be adapted, with attribution.

## How the guide is built
For each of the six Functions it gives **actions to consider**, sorted into *Understand, Assess, Prioritize, Communicate*, each tagged with a CSF 2.0 outcome ID such as `PR.AA-03`, plus **questions to consider** and a small starter worksheet.

## What the toolkit takes from it
| Function | Key actions (CSF IDs) | Used in toolkit item |
|---|---|---|
| Govern | Know the legal and contractual requirements (GV.OC-03); name who is responsible (GV.RR-02); assess the impact of losing key assets (GV.OC-04); check supplier risk before signing (GV.SC-06); consider cyber insurance (GV.RM-04); keep policies (GV.PO-01) | 2 Risk register, 3 Policies, 4 PDPA checklist |
| Identify | Inventory hardware, software, systems and services (ID.AM-01/02/04); **inventory and classify data** (ID.AM-07); find vulnerabilities (ID.RA-01); keep a **risk register** (ID.RA) | **1 Inventory, 2 Risk register** |
| Protect | Least-privilege access (PR.AA-05); **MFA everywhere** plus a password manager (PR.AA-03); change default passwords (PR.AA-01); patch and auto-update (PR.PS-02); **back up and test restores** (PR.DS-11); full-disk encryption (PR.DS-01); staff training (PR.AT-01/02) | 3 Policies, 6 Gap assessment |
| Detect | Know the signs of an incident (DE.CM); antivirus on all devices (DE.CM-09); watch for unusual behaviour (DE.CM-06/09); physical tampering (DE.CM-02); consider an MSSP for monitoring | 5 Incident plan, 6 Gap assessment |
| Respond | Have an incident plan and know who is in charge (RS.MA-01); assess severity and root cause (RS.AN-03, RS.MA-03) | 5 Incident plan |
| Recover | Restore from backups and confirm they work; communicate with stakeholders | 5 Incident plan |

## The guide's inventory worksheet (basis for toolkit item 1)
Its sample columns: *asset, official use, owner or administrator, sensitive data it can access, MFA required?, risk to the business if access is lost.*

The toolkit inventory **extends** this for the PDPA: what personal data, whose (customers, staff, patients, children), how many people, whether it is sensitive, why it's collected, where it's stored, who can see it, how long it's kept, and any processor or third party involved. Those fields feed the breach notification thresholds (1,000 people, significant harm) and the DPO test (20,000 / 10,000 / monitoring) in [pdpa-summary.md](pdpa-summary.md).

## The guide's MFA checklist
Banking, accounting and tax, merchant accounts, Google/Microsoft/Apple ID, email, password manager, website. For Malaysian SMEs the toolkit adds: **WhatsApp Business**, social media and ad accounts, marketplace seller centres, food-delivery merchant apps, government portals (tax, company registry) and the router/NAS/DVR admin logins.

## Common incident indicators (from the guide, used in item 5)
Losing access to data or services, an unusually slow network, antivirus alerts, many failed logins, bounced suspicious emails, unusual network traffic. For the five case-study businesses, add: customers reporting scam messages "from" the business (03), an existing email thread suddenly asking for payment to a new account (04), and strangers joining online classes (05).
