import json
import ipdb
import requests
import contentful



class ContentfulImporter(object):


    def __init__(self):

        super(ContentfulImporter, self).__init__()
        self.space_id = '2dktdnk1iv2v'
        self.access_token = '8559f3884f60fdd6f3a07de91411be8be4bd74478b8ad326e671399b7a486162'
        self.contentful_client = contentful.Client(self.space_id, self.access_token)
        self.unique_source_ids = self.fetch_unique_source_ids()
        self.category_map = self.fetch_category_map()

    def fetch_unique_source_ids(self):
        rx = self.contentful_client.entries({'content_type': 'location'})
        field_list = [x.fields().get('source_id') for x in rx if x.fields().get('source_id') is not None]
        return field_list

    def fetch_category_map(self):
        categories = self.contentful_client.entries({'content_type': 'category'})
        category_map = {category.name.lower().replace(' ', '_'): category.sys['id'] for category in categories.items}

        return category_map

    @property
    def _publish_headers(self):
        return {
            'Authorization': 'Bearer CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef',
            'X-Contentful-Content-Type': 'location'
        }

    @property
    def _content_headers(self):
        return {
            'Authorization': 'Bearer CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef',
        }

    @property
    def space_url(self):
        return 'https://api.contentful.com/spaces/{}'.format(self.space_id)

    def perform_contentful_request(self, req_method, endpoint, fields = None):
    
        method = None
        formatted_fields = None
        
        if req_method == 'post':
            method = requests.post
            formatted_fields = {'fields': {key: {"en-US": fields[key]} for key in fields}}
        elif req_method == 'get':
            method = requests.get


        request = method(
            self.space_url + endpoint, 
            headers=self._publish_headers, 
            json=formatted_fields
        )

        return request


    def import_location(self, category, fields, source, source_id):

        if source_id in self.unique_source_ids:
            print('location already exists with ID {}: '.format(source_id))
            return

        new_fields = fields.copy()
        category_id = self.category_map[category]
        new_fields.update({
            'dataSource': source,
            'sourceId': source_id,
            'category': category,
            'categoryRef': {'sys': {'id': category_id, 'linkType': 'Entry', 'type': 'Link'}}
        })

        request = self.perform_contentful_request('post', '/entries', new_fields)
        response = request.json()
        if request.status_code < 300:
            print 'created location {} successfully: id {}'.format(fields['name'].encode('utf-8'), response['sys']['id'])
        else:
            print 'failed to create with fields {}, got back {}'.format(fields, response)



    def import_rewe_to_go(self):

        json_file = open('./rewe-to-go.json')

        locations = json.load(json_file)
        sundays_open = [loc for loc in locations if loc['city'] == 'Berlin' and 'So' in loc['openingsHours'][0]['weekDays'].split(' ')]

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

            import_location('grocery', fields)



