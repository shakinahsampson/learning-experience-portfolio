"""Generates a synthetic coded-feedback table keyed to the existing INSIGHT360 learner records.
Deterministic (fixed seed). Entirely fictional. Run: python3 scripts/generate-feedback.py
"""
import csv
import json
import random
from pathlib import Path

root = Path(__file__).resolve().parent.parent
records = json.loads((root / 'src/data/learners.json').read_text())['records']
rng = random.Random(360)

THEMES = ['Relevant scenarios', 'Wanted more practice', 'Pacing too fast', 'Technical difficulties', 'Needed more manager support']


def pick(r):
    sat = r['satisfaction_1_5']
    if sat is None:
        return None
    weights = {'Relevant scenarios': 3 if sat >= 4 else 1, 'Wanted more practice': 2, 'Pacing too fast': 2 if sat <= 3 else 1,
               'Technical difficulties': 3 if r['delivery_mode'] == 'Virtual' else 1, 'Needed more manager support': 2 if sat <= 3 else 1}
    return rng.choices(list(weights), weights=list(weights.values()))[0]


rows = []
for r in records:
    t = pick(r)
    if t:
        rows.append({'learner_id': r['learner_id'], 'theme': t})

out = root / 'src/data/feedback-themes.json'
out.write_text(json.dumps({'notice': 'Entirely synthetic and fictional. Coded themes keyed to synthetic learner IDs.', 'themes': THEMES, 'records': rows}, indent=1))
with open(root / 'public/downloads/insight360-feedback-themes.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['learner_id', 'theme'])
    w.writeheader()
    w.writerows(rows)
print(len(rows), 'feedback rows')
