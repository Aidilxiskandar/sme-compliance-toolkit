# 02 Klinik Damai Sentosa (fictional)

| Field | Value |
|---|---|
| Type | General practice (GP) clinic |
| Location | Kajang, Selangor (one clinic) |
| Staff | 9 (2 doctors, 1 locum on weekends, 4 clinic assistants, 1 pharmacy assistant, 1 part-time admin) |
| Size | Small enterprise |
| Owner | Dr. Lim, 52, the lead doctor. Busy, trusts the vendor to "handle IT". |
| Security budget | About RM500 a month; would pay more after a scare |

## How the business runs
- A clinic management system (patient records, prescriptions, billing) installed on a **PC acting as the server** under the reception desk, bought from a local vendor 6 years ago.
- 4 PCs (reception, 2 consultation rooms, pharmacy) connect to it over the clinic network.
- Patients from company insurance panels: staff log in to several third-party administrator (TPA) web portals to check eligibility and submit claims.
- Lab results arrive by email (a free webmail account shared by the front desk) and on WhatsApp.
- Appointment reminders are sent from the clinic's WhatsApp.
- The vendor connects with a remote-access tool for support.

## Personal data held
- About **14,000 patient records** built up over 6 years.
- Patient registration: name, IC number, date of birth, address, phone, employer.
- **Medical records, diagnoses, prescriptions and lab results: sensitive personal data under the PDPA**, which carries stricter rules than ordinary data.
- Staff records and the locum's practising certificate copies.

## What the owner says
- "The vendor backs up the system."
- "Each staff member has their own login."
- "Our PCs have antivirus."

## What is actually true (planted gaps)
1. The "server" PC runs an **out-of-support Windows version** and the clinic management system has not been updated in 3 years.
2. Backups are a nightly copy to an **external hard disk that is always plugged into the server**. Ransomware would encrypt it too. Nobody has ever tested a restore.
3. Everyone at the front desk uses one shared login ("frontdesk"). The locum uses the lead doctor's login.
4. The vendor's remote-access tool is **always on and unattended**, with a password that hasn't changed since installation.
5. The shared webmail account has no 2-step verification and its password is on a card by the reception monitor. It holds years of lab results.
6. Lab results and IC photos are sent over **personal WhatsApp** on staff phones.
7. No written consent or notice for processing sensitive data, and no process for patients who ask for a copy of their records.
8. No incident plan: nobody knows the PDPA breach notification duty exists.

## Incident history
- Two months ago, a reception PC showed a fake "your PC is infected, call this number" pop-up. A staff member called the number before the doctor stopped them. Nobody checked whether anything was installed.
