import ipdb
import codecs
import json
import re
js = json.load(open('filtered.geojson'))

def makeDict(tg):
    split = tg.split("\", \"")
    retVal = {}
    for x in split:
        try:
            key, value = x.replace('"', '').split("=>")
            retVal[key] = value 
        except:
            pass



    return retVal 

ft = js['features']
listings = ft

hour_search = re.compile('Su(.*PH)? ([0-9]{2}:[0-9]{2})-([0-9]{2}:[0-9]{2})')


formatted_listings = {}

opening_hours = []

for listing in listings:
    props = listing.get('properties')
    tags = props.get('tags')


    formatted = makeDict(tags)
    hours = formatted.get('opening_hours')
    if hours is None \
            or 'Su' not in hours \
            or 'of' in hours:
        continue

    opening_hours.append(hours + '\n')
    relevant_data = {key: props[key] for key in props if props[key] is not None} 

    relevant_data.update(formatted)
    del(relevant_data['tags'])
    relevant_data['geometry'] = listing['geometry']
    matches = hour_search.findall(hours)
    if len(matches) > 0:
        hours_match = matches[0]
        relevant_data['sunday'] = {
            'open': hours_match[1].replace(':', ''),
            'close': hours_match[2].replace(':', '')
        }

    category = props['shop']
    category_array = formatted_listings.get(category, [])
    category_array.append(relevant_data)
    formatted_listings[category] = category_array

with codecs.open("hours.txt", "w", encoding="utf-8") as hours_text:
    hours_text.writelines(opening_hours)

with open('formatted_listings_with_hours.json', 'w') as formatted_json:
    json.dump(formatted_listings, formatted_json)

