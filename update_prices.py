# -*- coding: utf-8 -*-
import urllib
import urllib2
import csv
import re
import json
import time

""" Used to scrap the prices for some medicines with the public information at Salcobrand.
    The merge with the original data is in other script... sorry... """

# getting the just the name of the medicines.
filename = 'bioequivalents.csv'
products = []
with open(filename, 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in csvreader:
        medicine_name = row[2].strip()
        match = re.match('(.*) ([Cc]omprimidos.*) ([0-9,]+ mg)', medicine_name)
        if match:
            groups = match.groups()
            products.append({
                'id': row[0],
                'name': groups[0],
                'type': groups[1],
                'info': groups[2]
            })
            continue

        match = re.match('(.*) ([Cc]ápsulas.*) ([0-9,]+ mg)', medicine_name)
        if match:
            groups = match.groups()
            products.append({
                'id': row[0],
                'name': groups[0],
                'type': groups[1],
                'info': groups[2]
            })
        else:
            print 'NOT RECOGNIZED: {0}'.format(row[2])

# stealing data, cof cof, btw, great capcha!
url = 'http://www.salcobrand.cl/cl/'
data = {'cms_salco': 'buscarproductos', 'producto': ''}
for product in products:
    print('Searching for {0} of {1}'.format(product['name'], product['info']))
    # avoiding problems with this guys
    # time.sleep(4) # naaaa, if they do not know how to correctly implement a captcha, they wont block us
    data.update({'producto': product['name']})
    encoded_data = urllib.urlencode(data)
    req = urllib2.Request(url, encoded_data)
    response = urllib2.urlopen(req)
    response = json.loads(response.read())

    # here we have 2 cases:
    # one product matches the search or no product matches the search
    if len(response) == 1:
        product['price'] = response[0]['precio_referencia']
        print "Producto: {0}, Precio: {1}".format(product['name'], product['price'])
    else:
        # more than one product matches the search
        for r in response:
            info = ''.join(product['info'].split(' '))
            if info in r['nombre_producto']:
                product['price'] = r['precio_referencia']
                print "Producto: {0}, Precio: {1}".format(product['name'], product['price'])

print json.dumps(products)
