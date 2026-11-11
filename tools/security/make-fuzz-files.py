"""Create hostile import files for attacks.mjs. Usage: python3 make-fuzz-files.py <out-dir>"""
import json, os, sys
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
w = lambda n, s: open(os.path.join(out, n), 'w').write(s)
base = {"schema": "sme-toolkit/1", "id": "fz", "profile": {"name": "Fuzz"}}
w('big.json', '{"schema":"sme-toolkit/1","profile":{"name":"x"},"assets":[' + ','.join(['{"name":"' + 'A' * 1000 + '"}'] * 3000) + ']}')
w('broken.json', '{"schema": "sme-toolkit/1", "profile": {"name": "x"')
w('deep.json', '[' * 100000 + ']' * 100000)
w('proto.json', '{"schema":"sme-toolkit/1","id":"proto","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}},"profile":{"name":"Proto","__proto__":{"polluted3":"yes"}},"checklist":{"__proto__":{"status":"yes"}},"assessments":[{"name":"r","answers":{"__proto__":{"level":3}}}]}')
w('many.json', json.dumps({**base, "id": "many", "assets": [{"name": f"d{i}"} for i in range(800)]}))
w('types.json', json.dumps({**base, "id": "types", "profile": {"name": {"evil": 1}, "staff": "9e999", "sector": ["x"]}, "assets": "notalist", "risks": [{"title": 5, "likelihood": "NaN", "impact": 1e308}], "assessments": {"not": "list"}}))
print('written to', out)
