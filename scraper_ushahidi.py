import requests
import urllib.parse
import pandas as pd
import json

MAIN_URL = 'https://redaktor.api.ushahidi.io/api/v3/posts?'
VARS = {
        'has_location': 'all',
        'limit': 20,
        'offset': 0,
        'order': 'desc',
        'order_unlocked_on_top': 'true',
        'orderby': 'created',
        'q': 'Mutual Aid'
}

responses = []
limit = 20

while limit <= 50:

    VARS['offset'] = limit

    limit += 20

    url = MAIN_URL + urllib.parse.urlencode(VARS)
    resp = requests.get(url)
    print(url)
    responses = responses + [resp.content]
"""
Keys to access the JSON dictionary.
"""
URL_KEY = 'd1ece52a-29b7-4a80-8cdf-6029be6c3b18'
GEO_KEY = 'cad90e3b-041e-4cb9-80be-a0e07c812c43'
UNI_KEY = '821258c3-2568-4658-9ebf-03f054dae743'
LOC_KEY = 'dc54521b-db6d-4a82-89f4-99ebb2a831f1'


mutual_aid_groups = []
for response in responses:
    json_array_results = json.loads(response)['results']
    for item in json_array_results:

        mutual_aid_details = {'Name': item['title'],
                              'Homepage': item['values'][URL_KEY][0],
                              'Lat': item['values'][GEO_KEY][0]['lat'],
                              'Lng': item['values'][GEO_KEY][0]['lon'],
                              'Description': item['content'],
                              'Locality': item['values'][LOC_KEY][0],
                              'ListingSource': 'redactor.api.ushahidi.io',
                              'ListingSourceId': item['values'][UNI_KEY][0],
                              'ListingSourceUpdated': item['post_date']
                              }

        mutual_aid_groups.append(mutual_aid_details)

data = pd.DataFrame(mutual_aid_groups)
data.to_csv('redaktor_ushahidi.csv')


