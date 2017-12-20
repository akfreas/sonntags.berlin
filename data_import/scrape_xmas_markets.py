import mechanize
from pdb import set_trace as bp
import re
from bs4 import BeautifulSoup
import os.path

browser = mechanize.Browser()


def fetch_page_urls():

    browser.open("https://www.weihnachteninberlin.de/weihnachtsmaerkte/bezirke/")
    matching_links = [link for link in browser.links() if "rkte in" in unicode(link.text) ]


    page_regex = re.compile('.*(weihnachtsmaerkte)/.*([0-9]{1,7}\-[0-9]{1,7}).*')

    target_page_urls = []

    for link in matching_links:
        list_page = browser.open(link.absolute_url)

        for target_link in browser.links():
            match = page_regex.match(target_link.absolute_url)
            if match is None:
                continue
            
            target_page_urls.append(target_link.absolute_url)

    target_page_urls = list(set(target_page_urls))
    return target_page_urls


pagelist_filename = "links.txt"

if os.path.exists(pagelist_filename):

    with open(pagelist_filename) as f:
        target_page_urls = f.readlines()
else:
    target_page_urls = fetch_page_urls()
    with open(pagelist_filename, 'w') as f:
        f.writelines(map(lambda x:x+'\n', target_page_urls))

for target_link in target_page_urls:

    market_page = browser.open(target_link)
    soup = BeautifulSoup(market_page.read(), 'html.parser')
    matching_content = [dx for dx in soup.find_all('div') if dx.get('class') is not None and 'mod_contentteaser floatbox' in " ".join(dx['class'])]
    sundays_open = [dx for dx in matching_content if \
            'Sonntag' in dx.text \
            or 'nungszeiten' in dx.text]
    print "matching content count: " + str(len(matching_content))
    #print matching_content
    #bp()
    with open('markt_dump.html', 'a') as f:
        write = map(lambda x:x.prettify().encode('UTF-8')+'\n', matching_content)
        f.writelines(write)

    try:
        print matching_content[0].div.h3.text

        time_info = [div for div in matching_content if "Wann:" in div.text][0].div.h3 or None
        print time_info
        address_info = [div for div in matching_content if "Wo:" in div.text][0].div.p or None
        print address_info
    except:
        pass
    continue

    for content in matching_content:

        try:
            print content.div.h3.text
        except:
            pass

