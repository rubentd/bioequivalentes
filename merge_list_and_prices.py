import json

results = open('data/results.json')
prices = open('data/prices.json')

products_w_price = json.loads(prices.read())

prices = {}
for product in products_w_price:
    if product.has_key('price'):
        prices[product['id']] = product['price']
    else:
        pass
        # print product

products_wout_price = json.loads(results.read())
for product in products_wout_price:
    if prices.has_key(product[0]):
        product.append(prices[product[0]])
    else:
        product.append('0')

print(json.dumps(products_wout_price))
