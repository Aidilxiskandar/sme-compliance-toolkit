# Case study: what five small Malaysian businesses get wrong about security, and what fixing it costs

> The five businesses are **fictional**, built to test this toolkit (see [ADR 0002](adr/0002-fictional-case-studies.md)). Numbers come from [phase3-results.md](phase3-results.md), which is generated from the data in `data/`. Costs are rough planning estimates from November 2026, not quotes. Not legal advice.

## The problem
Malaysia's Personal Data Protection Act was tightened in 2025. Every business that holds personal data must now be ready to report serious breaches to the Commissioner within 72 hours and keep a breach register. Many must appoint a Data Protection Officer, and some must register and pay a yearly fee. Most small businesses don't know this, and the security frameworks that would help (ISO/IEC 27001, NIST CSF, CIS Controls) are written for organisations with an IT team.

This toolkit cuts those frameworks down to **32 controls** a five-person business can act on, adds the PDPA duties, and puts it all in a free web app that keeps the data on the owner's own device.

## The five businesses
| Business | Type | Staff | What's at stake |
|---|---|---|---|
| Kopi Senja | Cafe, Ipoh | 6 | 800 customer phone numbers, CCTV, staff IC and bank photos |
| Klinik Damai Sentosa | GP clinic, Kajang | 9 | 14,000 patients' health records (sensitive data) |
| Rumah Batik Lestari | Online shop, Kota Bharu | 4 | 15,000 customers' addresses; ad tracking on 30,000 visitors |
| Tan & Rahim Associates | Accounting firm, Johor Bahru | 12 | Client financials, IC copies, payroll for 11,000 people |
| Pusat Tuisyen Cemerlang | Tuition centre, Seremban | 8 | 850 children's records, photos and medical notes |

Each profile has two views: what the owner *says* in an interview, and what is *actually true*, with 8 planted gaps per business (40 in all).

## How they were assessed
1. **Inventory:** devices, online accounts and personal data for each business. The app turns these into PDPA duties (register? DPO? what would a breach trigger?) and quick findings.
2. **Gap assessment:** one question per control, each with what to *ask* and *how to check* the evidence, scored 0 to 3. Every business was scored three times: the owner's self-assessment, a verified assessment, and a verified assessment after fixes.
3. **Action plan:** the fixes, their cost and effort, and what's left.

Before scoring, the question bank was tested against the 40 planted gaps. **Three gaps had no question that would reveal them** (patients asking for their records, reused online-class links, tutors messaging students with no rules). Those questions were improved before the businesses were scored.

## Findings

### 1. Owners overrate their security, and the biggest gaps are the ones they're sure about
| Business | Self-assessed | Verified | Assurance gaps* |
|---|---|---|---|
| Kopi Senja | 28% | 6% | 12 |
| Klinik Damai Sentosa | 22% | 9% | 8 |
| Rumah Batik Lestari | 20% | 5% | 7 |
| Tan & Rahim Associates | 31% | 22% | 6 |
| Pusat Tuisyen Cemerlang | 11% | 3% | 4 |

\* Controls the owner rated as in place that the evidence showed were not.

Asking owners alone would have found **23 of the 40** planted gaps (57.5%). The rest hid behind confident answers:
- *"Google keeps everything backed up."* The only copy was one personal Google account without MFA.
- *"Each staff member has their own login."* The clinic's front desk shared one login, and the locum used the lead doctor's.
- *"We use a big-name cloud provider, so email is secure."* The accounting firm had no MFA on any mailbox, and a client nearly paid a fake invoice sent from inside a real email thread.
- *"The Wi-Fi has a password, it's on the menu board."* Customers on that Wi-Fi could reach the cafe's POS and CCTV recorder, which still had its default password.

**Lesson for any assessor:** never score a control on the answer alone. Look at the setting, the user list or the backup.

### 2. Tiny businesses can carry big legal duties
| | Register with JPDP | DPO needed | Why |
|---|---|---|---|
| Kopi Senja | No | Grey area | F&B isn't a registration class; CCTV "may" count as monitoring |
| Klinik Damai Sentosa | **Yes** (RM300/yr) | **Yes** | Private clinic; health data on more than 10,000 people |
| Rumah Batik Lestari | Check | **Yes** | Over 20,000 people; ad-pixel retargeting is "systematic monitoring" |
| Tan & Rahim Associates | **Yes** (RM200/yr) | **Yes** | Accounting firm; financial data on more than 10,000 people |
| Pusat Tuisyen Cemerlang | Check | No | Under the thresholds |

A 4-person online shop and a 12-person accounting firm both need a Data Protection Officer. Neither knew.

### 3. Incidents were already happening, and nobody recorded them
Four of the five had a recent incident: an Instagram takeover (cafe), a tech-support scam call (clinic), customers getting scam messages using real order details (batik shop), and a fake invoice inside a real email thread (accounting firm). None were assessed for breach notification. The batik shop's case is probably notifiable, and its 72 hours had already passed, so it needs a late notice explaining the delay. The tuition centre's stranger in an online class was handled well (parents told the next day), but it wasn't recorded either.

### 4. Most fixes are free
| Business | Verified before | After fixes | Cost of fixes done | Still planned |
|---|---|---|---|---|
| Kopi Senja | 6% | **55%** | RM700 | – |
| Klinik Damai Sentosa | 9% | **56%** | RM1,700 + RM90/month | Replace unsupported server (about RM4,500) |
| Rumah Batik Lestari | 5% | **51%** | RM150 + RM30/month | Laptop encryption |
| Tan & Rahim Associates | 22% | **58%** | RM1,300 + RM250/month | Managed laptops (about RM5,000), retention clean-up |
| Pusat Tuisyen Cemerlang | 3% | **47%** | RM0 | – |

The tuition centre's fixes cost nothing: removing ex-tutors from a spreadsheet, a waiting room for online classes, a parental consent form, MFA, and a code of conduct. Across all five, the fixes cost about **RM3,850 one-off and RM370 a month**, and left **3 of 40** planted gaps open, all of them budgeted for 2027.

The cheapest high-value fixes, in order:
1. **MFA** on email, banking, social media and cloud storage.
2. **Remove old accounts** (former staff, freelancers, vendors) and stop sharing logins.
3. **Change default passwords** and **separate guest Wi-Fi**.
4. **An offline backup**, plus actually testing a restore.
5. **A privacy notice, consent, and a one-page breach plan.**

## What "after" doesn't mean
Scores of 47–58% are not "secure". Level 2 means a control is in place; level 3 means it is checked regularly, and that only comes with time. The point of the toolkit is to get a business from "nobody knows" to "the basics are done and we know what's left".

## Limits of this study
- The businesses are fictional and were written by the same person who built the assessment, so the verified scores partly grade their own answer key. The coverage test and the self-assessment comparison are the meaningful results.
- Where a profile didn't record what the owner said about a control, the self-assessment assumes the owner answered honestly. Real gaps between belief and reality are probably larger.
- Costs are rough estimates, and legal points are a starting point, not advice.

## For an MSSP
The pattern is the business case for a managed security service for small businesses: owners can't see their own gaps, the first fixes are cheap, and the ongoing work (checking access every quarter, testing restores, watching sign-in alerts, handling incidents within 72 hours) is exactly what small businesses won't do alone.
