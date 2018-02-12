import ipdb
import codecs
import json
import re
import sys
import os
import argparse

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


def chunk_large_json(filename, start_pos):

    with codecs.open(filename, 'r', encoding='utf-8') as fp:

        byte = 1
        fp.seek(start_pos)
        char = fp.read(byte)
        while char != '[':
            char = fp.read(1)

        current_chunk = read_next_dict(fp)
        extracted_stores = {}
        filesize = os.stat(filename).st_size
        while current_chunk is not None:
            sys.stdout.write('\r')
            sys.stdout.write('reading at pos ' + str(fp.tell()) + ', ' + str(fp.tell() / filesize))
            sys.stdout.flush()

            current_chunk = read_next_dict(fp)
            if 'opening_hours' in current_chunk:

                try:
                    shop_json = json.loads(current_chunk)
                    extracted = extract_shop(shop_json)
                    if extracted is not None:
                        category, shop = extracted
                        cat_list = extracted_stores.get(category, {})
                        cat_list[shop.get('osm_id')] = shop
                        extracted_stores[category] = cat_list
                        update_json_with_extracted('hamburg-scraped-new.json', extracted_stores)


                except AttributeError as e:
                    raise e

    return extracted_stores

def update_json_with_extracted(filename, extracted):

    if os.path.exists(filename) is False:
        with open(filename, 'w') as touch:
            touch.write('{}')
            touch.flush()

    with open(filename) as existing_json:

        existing_entries = json.load(existing_json)

        for category in existing_entries:
            update_category = extracted.get(category, None)
            if update_category is None:
                continue

            del(extracted[category])
            existing_entries[category].update(update_category)

        existing_entries.update(extracted)

    with open(filename, 'w') as fp:
        json.dump(existing_entries, fp)


def read_next_dict(fp):

    pos = fp.tell()-1 
    fp.seek(pos)

    byte = fp.read(1)

    if byte == "]":
        return None

    while byte != '{':
        byte = fp.read(1)
    chunk = byte
    open_bracket_count = 1
    while open_bracket_count != 0:
        byte = fp.read(1)
        if byte == '{':
            open_bracket_count += 1
        elif byte == '}':
            open_bracket_count -= 1
        

        chunk += byte

    return chunk

def extract_shop(listing):


    hour_search = re.compile('Su(.*PH)? ([0-9]{2}:[0-9]{2})-([0-9]{2}:[0-9]{2})')

    props = listing.get('properties')
    category = props.get('shop')

    hours = props.get('opening_hours')
    if hours is None \
            or category is None \
            or 'Su' not in hours \
            or 'of' in hours:
        return None

    matches = hour_search.findall(hours)

    relevant_data = {}
    if len(matches) > 0:
        hours_match = matches[0]
        relevant_data['sunday'] = {
            'open': hours_match[1].replace(':', ''),
            'close': hours_match[2].replace(':', '')
        }

    relevant_data.update(props)
    relevant_data['geometry'] = listing.get('geometry').get('coordinates')
    relevant_data['osm_id'] = props.get('id')

    return (category, relevant_data)

def scrape_hours(source_file, dest_file, start_pos=0):

    formatted_listings = chunk_large_json(source_file, start_pos)

    with open(dest_file, 'w') as formatted_json:
        json.dump(formatted_listings, formatted_json, indent=4)

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Scrape hours from OSM data')
    parser.add_argument('source', help='Source file')
    parser.add_argument('destination', help='Destination file')
    parser.add_argument('-p', '--startpos', type=int, help='Starting file position')
    args = parser.parse_args()

    scrape_hours(args.source, args.destination, args.startpos)
