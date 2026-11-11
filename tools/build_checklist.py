"""Generate toolkit/pdpa-checklist.md from data/pdpa-checklist.json (the same data the app uses)."""
import json
d = json.load(open('data/pdpa-checklist.json'))
WHEN = {'registration': 'if your business is in one of the 13 registration classes', 'sensitive': 'if you hold sensitive data',
        'minors': "if you hold children's data", 'cctv': 'if you use CCTV'}
L = ['# PDPA checklist for small businesses', '',
     '> Generated from `data/pdpa-checklist.json` by `tools/build_checklist.py`. The web app has an interactive version that hides items that don\'t apply and keeps a score.',
     '', '> Not legal advice. ' + d['about'].split('. Not legal advice.')[0] + '.', '',
     'Tick each item: **Yes / Partly / No / Not applicable**. Every "No" is something to fix, and the linked toolkit control says how (see [framework-mapping.md](../docs/framework-mapping.md)).', '']
group = None
for it in d['items']:
    if it['group'] != group:
        group = it['group']; L += ['', f'## {group}', '', '| | Check | Why / how | Source | Control |', '|---|---|---|---|---|']
    q = it['q'] + (f" *(Only {WHEN[it['when']]}.)*" if it.get('when') else '')
    L.append(f"| ☐ {it['id']} | {q} | {it['help']} | {it['ref']} | {it['control']} |")
open('toolkit/pdpa-checklist.md', 'w').write('\n'.join(L) + '\n')
print(len(d['items']), 'items')
