# on rewe to go site: 
# JSON.stringify(angular.element(document.getElementById('locationApp')).scope().data)
json_file = open('./rewe-to-go.json')

locations = json.load(json_file)
sundays_open = [loc for loc in locations if 'So' in loc['openingsHours'][0]['weekDays'].split(' ')]

importer = ContentfulImporter(
    space_id='2dktdnk1iv2v', 
    access_token='8559f3884f60fdd6f3a07de91411be8be4bd74478b8ad326e671399b7a486162',
    publish_token='CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef'
)
for location in sundays_open:
    street_name = ''.join([i for i in location['street'].encode('utf-8') if not i.isdigit()])
    name = 'REWE To Go {}'.format(street_name)
    fields = {
            'name': name,
            'address': " ".join([location['street'],location['zipCode'], location['city']]),
            'openingTime': location['openingsHours'][0]['from']*100,
            'closingTime': location['openingsHours'][0]['to']*100,
            'phoneNumber': location['phone'],
    }

    lat_lon = location.get('location')
    if lat_lon is None:
        fields['location'] = fields['address']
    else:
        fields['location'] = {'lat': lat_lon['lat'], 'lon': lat_lon['lng']}

    source_id = 'rewe_to_go/' + location['$$hashKey'] 
    importer.import_location('grocery', fields, 'rewe_to_go_json', source_id, publish=True)


