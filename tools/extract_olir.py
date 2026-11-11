"""Extract CSF 2.0 subcategories with their ISO/IEC 27001:2022 and CIS Controls v8.1
informative references from NIST's CSF 2.0 Reference Tool export (TSV of the 'CSF 2.0' sheet).
Writes data/csf2-olir.json. Only reference IDs are kept, never ISO or CIS text."""
import sys, re, json
rows = [l.split('\t') for l in open(sys.argv[1], encoding='utf-8').read().split('\n')]
out, cur = [], None
for r in rows[2:]:
    r += [''] * (5 - len(r))
    m = re.match(r'([A-Z]{2}\.[A-Z]{2}-\d{2}):\s*(.*)', r[2].strip())
    if m:
        cur = None if 'Withdrawn' in m.group(2) else {'id': m.group(1), 'text': m.group(2).strip(), 'iso': [], 'cis': []}
        if cur: out.append(cur)
    elif r[2].strip():
        cur = None
    if not cur:
        continue
    for ref in r[4].split('|'):
        ref = ref.strip()
        a = re.match(r'ISO/IEC 27001:2022: Annex A Controls: ([\d.]+)', ref)
        c = re.match(r'ISO/IEC 27001:2022: Mandatory Clause: ([\d.]+)', ref)
        k = re.match(r'CIS Controls v8\.1: ([\d.]+)', ref)
        if a and a.group(1) not in cur['iso']: cur['iso'].append(a.group(1))
        if c and 'Cl.' + c.group(1) not in cur['iso']: cur['iso'].append('Cl.' + c.group(1))
        if k and k.group(1) not in cur['cis']: cur['cis'].append(k.group(1))
json.dump({'source': 'NIST CSF 2.0 Reference Tool export, all informative references (csrc.nist.gov), downloaded 2026-11-11',
           'subcategories': out}, open(sys.argv[2], 'w'), indent=1)
print(len(out), 'active subcategories')
