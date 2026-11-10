# 04 Tan & Rahim Associates (fictional)

| Field | Value |
|---|---|
| Type | Accounting, bookkeeping, tax and company secretarial firm |
| Location | Johor Bahru, Johor (one office) |
| Staff | 12 (2 partners, 6 accountants and tax staff, 2 interns, 1 admin, 1 receptionist) |
| Size | Small enterprise |
| Owners | Mr. Tan, 58 (audit and tax) and Pn. Rahim, 45 (corporate and secretarial). The most security-aware owners of the five, and the most exposed. |
| Security budget | About RM1,500 a month, plus a one-off project if justified |

## How the business runs
- Cloud email and office apps for everyone (a business subscription tier), plus accounting software in the cloud for clients.
- A **NAS in the office** holds all client folders: financial statements, bank statements, payroll, IC and passport copies of directors.
- Staff log in to government tax and company registry portals **on behalf of clients**, and to clients' online banking for some bookkeeping clients.
- Mix of office desktops and staff's own laptops (interns bring their own). Some staff work from home two days a week and reach the NAS through a port opened on the router.
- Clients send documents by email, WhatsApp and USB drives.

## Personal data held
- Hundreds of client companies and their directors: IC/passport copies, addresses, income, bank details, tax numbers.
- Client employees' payroll data (names, salaries, IC numbers, bank accounts).
- Logins to client portals, kept in a spreadsheet.

## What the owners say
- "We use a big-name cloud provider, so email is secure."
- "The NAS is in a locked room."
- "Staff know not to click on strange links."

## What is actually true (planted gaps)
1. **No MFA** on the cloud email accounts. Legacy sign-in methods are still allowed.
2. The NAS admin interface and file sharing are **reachable from the internet** through a forwarded port, and the NAS firmware is 2 years out of date.
3. Client portal and banking logins are kept in a **spreadsheet called "passwords.xlsx"** on the NAS, readable by every staff member including interns.
4. No process to check payment changes: a client or supplier emailing "our bank account has changed" would just be updated.
5. Interns' and remote staff's personal laptops have no disk encryption and are not managed, and client files get synced to them.
6. The NAS has snapshots, but there is **no offsite or offline backup**.
7. Former staff accounts are disabled but still hold mail, and one former intern's account was never disabled.
8. No retention rule: client records from 15+ years ago, including closed clients' IC copies, are kept forever.

## Incident history
- Last quarter a client nearly paid a fake invoice after receiving an email that appeared to come from the firm, replying in an **existing email thread**. That suggests one of the firm's mailboxes, or the client's, has been compromised. Nobody investigated.
