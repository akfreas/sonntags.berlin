import json
import ipdb
import requests
import contentful



class ContentfulImporter(object):


    def __init__(self, space_id, access_token=None, publish_token=None):

        super(ContentfulImporter, self).__init__()
        self.space_id = space_id
        self.access_token = access_token
        self.publish_token = publish_token
        self.content_type_map = None

        if access_token:
            self.contentful_client = contentful.Client(self.space_id, self.access_token)
            self.unique_source_ids = self.fetch_unique_source_ids()
            self.category_map = self.fetch_category_map()

    def create_location_content_type(self, content_type_json):
        self.perform_contentful_request('post', '/content_types', content_type_json, False)

    def fetch_unique_source_ids(self):
        try:
            rx = self.contentful_client.entries({'content_type': 'location'})
            field_list = [x.fields().get('source_id') for x in rx if x.fields().get('source_id') is not None]
            return field_list
        except:
            return []

    def fetch_content_type_id(self, content_type_name):

        if self.content_type_map is None:
            self.content_type_map = {content_type.name.lower(): content_type.id for content_type in self.contentful_client.content_types()}
        
        return self.content_type_map.get(content_type_name.lower())

    def fetch_category_map(self):
        try:
            categories = self.contentful_client.entries({'content_type': 'category'})
            category_map = {category.name.lower().replace(' ', '_'): category.sys['id'] for category in categories.items}

            return category_map
        except:
            return {}

    def _publish_headers(self, content_type_id=None):
        headers = {
            'Authorization': 'Bearer {}'.format(self.publish_token),
        }

        if content_type_id:
            headers['X-Contentful-Content-Type'] = content_type_id

        return headers

    @property
    def _content_headers(self):
        return {
            'Authorization': 'Bearer {}'.format(self.publish_token),
        }

    @property
    def space_url(self):
        return 'https://api.contentful.com/spaces/{}'.format(self.space_id)

    def perform_contentful_request(self, req_method, \
            endpoint, content_type=None, \
            fields=None, localized=True,
            additional_headers={}):
    
        method = None
        formatted_fields = None
        
        if req_method == 'post':
            method = requests.post
            if localized:
                formatted_fields = {'fields': {key: {"en": fields[key]} for key in fields}}
            else:
                formatted_fields = fields
        elif req_method == 'get':
            method = requests.get
        elif req_method == 'put':
            method = requests.put
        elif req_method == 'delete':
            method = requests.delete

        
        content_type_id = self.fetch_content_type_id(content_type) if content_type else None
        headers = self._publish_headers(content_type_id)
        headers.update(additional_headers)
        try:
            request = method(
                self.space_url + endpoint, 
                headers=headers, 
                json=formatted_fields,
                timeout=2.0
            )
        except requests.exceptions.Timeout as e:
            print e
            return self.perform_contentful_request(req_method, endpoint, content_type, fields, localized, additional_headers)

        return request


    def delete_location(self, contentful_id):
        print('deleting entry {}'.format(contentful_id))
        request = self.perform_contentful_request('delete', '/entries/{}'.format(contentful_id), 'location', fields={})
        
 
        if request.status_code < 300:
            print('successfully deleted entry with id {}'.format(contentful_id))
        else:

            response = request.json()
            print('failed to delete {}, got back {}'.format(contentful_id, response))
            raise Exception('ContentfulImportException')

    def import_location(self, category, fields, source, source_id, publish=False):

        existing_entries = self.contentful_client.entries({
            'content_type': 'location', 
            'fields.sourceId': source_id.split('/')[1:]
        })

        if existing_entries.total > 0:
            for entry in [e.id for e in existing_entries]:
                self.unpublish_entry(entry)
                self.delete_location(entry)

        existing_entries = self.contentful_client.entries({
            'content_type': 'location', 
            'fields.sourceId': source_id
        })
        if existing_entries.total > 0:
            print('location already exists with ID {}: '.format(source_id))
            return

        new_fields = fields.copy()
        category_id = self.category_map[category]
        new_fields.update({
            'dataSource': source,
            'sourceId': str(source_id),
            'categoryRef': {'sys': {'id': category_id, 'linkType': 'Entry', 'type': 'Link'}}
        })

        request = self.perform_contentful_request('post', '/entries', 'location', new_fields)
        response = request.json()

        if request.status_code < 300:
            entry_id = response['sys']['id']
            print('created location {} successfully: id {}'.format(
                    fields['name'].encode('utf-8'), 
                    response['sys']['id']
            ))

            if publish:
                self.publish_entry(entry_id, response['sys']['version'])

        else:
            print('failed to create with fields {}, got back {}'.format(new_fields, response))
            raise Exception('ContentfulImportException')


    def unpublish_entry(self, entry_id):
        url = '/entries/{}/published'.format(entry_id)
 
        request = self.perform_contentful_request('delete', url)
        response = request.json()

        if request.status_code < 300:
            print('unpublished entry {} successfully.'.format(entry_id))
        else:
            print('could not unpublish entry: {}'.format(response))
            raise Exception('ContentfulImportException')




    def publish_entry(self, entry_id, version):

        url = '/entries/{}/published'.format(entry_id)
        headers = {'X-Contentful-Version': str(version)}
 
        request = self.perform_contentful_request('put', url, 
                additional_headers=headers)
        response = request.json()

        if request.status_code < 300:
            print('published entry {} successfully.'.format(entry_id))
        else:
            print('could not publish entry: {}'.format(response))
            raise Exception('ContentfulImportException')




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



