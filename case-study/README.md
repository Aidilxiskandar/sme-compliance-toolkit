# Case studies: five fictional small businesses

> **All five businesses are fictional.** They were invented for this toolkit, and any resemblance to a real business or person is coincidental. Domains use the reserved `.example` suffix.

Instead of auditing a real business, and publishing its weaknesses, the kit is tested on five invented ones. Because we built them, we know their **true** security state. Each profile has two views:

- **What the owner says:** what you would hear in an interview. This is the input to the gap assessment.
- **What is actually true:** the planted gaps. These are the answer key that the assessment should uncover.

The five were chosen to cover different data, risks and PDPA issues:

| # | Business | Type | Staff | Main data at risk | What it tests |
|---|---|---|---|---|---|
| 01 | [Kopi Senja](companies/01-kopi-senja.md) | Cafe, Ipoh | 6 | Customer phone numbers, CCTV, staff records | The micro baseline: shared Wi-Fi, a POS, WhatsApp marketing |
| 02 | [Klinik Damai Sentosa](companies/02-klinik-damai-sentosa.md) | GP clinic, Kajang | 9 | Patient health records (**sensitive** data under PDPA) | Sensitive personal data, an on-site server, ransomware |
| 03 | [Rumah Batik Lestari](companies/03-rumah-batik-lestari.md) | Online shop, Kota Bharu | 4 | Customer names, addresses, phone numbers | E-commerce, social account takeover, third-party platforms |
| 04 | [Tan & Rahim Associates](companies/04-tan-rahim-associates.md) | Accounting firm, Johor Bahru | 12 | Client financials, IC copies, tax logins | Email fraud (BEC), cloud email without MFA, a NAS |
| 05 | [Pusat Tuisyen Cemerlang](companies/05-pusat-tuisyen-cemerlang.md) | Tuition centre, Seremban | 8 | Children's data, parents' contacts | Minors' data, consent, free consumer accounts |

## How they are used
1. **Phase 1:** fill in the asset/personal-data inventory and the risk register for each business.
2. **Phase 3:** run the gap assessment on the "owner says" view for a **before** score, then check that it finds the planted gaps in the "actually true" view. Missed gaps show where the assessment questions need to improve.
3. Apply the low-cost fixes from the kit, then work out an **after** score and the cost.
