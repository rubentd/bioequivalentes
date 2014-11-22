import csv
import json
import urllib2

url = 'http://datos.gob.cl/uploads/recursos/16092014listado_cronologico_ver_004.csv'
response = urllib2.urlopen(url).read()

# to write a decent version of the file
filename = 'bioequivalents.csv'
f = open(filename, 'w')

# reading the original csv file and cleaning it
lines = [line.strip() for line in response.split('\n')]
for line_number, line in enumerate(lines):
    # row cleaning
    if line.startswith('"'):
        lines[line_number] = line[1:-1].replace('""', '"')
    # writing the file again, with decent rows
    f.write(lines[line_number] + '\n')
f.close()

# generating some JSON, from the previously created CSV
result = []
with open(filename, 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in csvreader:
        clean_row = []
        for cell in row:
            clean_row.append(cell.strip())
        result.append(clean_row)

print json.dumps(result)
