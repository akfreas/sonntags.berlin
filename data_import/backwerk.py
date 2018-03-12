import json

# find backwerk.json on backwerk site in view source
with open('backwerk.json') as backwerk_file:

    bk_json = json.load(backwerk_file)

for bk in bk_json:

    info = bk.get('info')
    opening = info.get('opening')


