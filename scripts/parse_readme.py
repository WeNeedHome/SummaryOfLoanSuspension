# -*- coding: utf-8 -*-

import re
import json

with open('../README.md', 'r') as f:
    data = f.read()

data = data.split('## 江西省')[1]
data = '## 江西省' + data

target_dir = '../data'

data = [item.strip() for item in data.split('##') if item.strip() != '']
for province in data:
    province_data = province.split('\n', 1)

    province_name = province_data[0].strip()
    province_name = re.sub(r'[ ?[0-9]+ ?]', '', province_name)

    target_file = target_dir + '/' + province_name + '.json'
    target_data = []

    province_cities = [item.strip() for item in province_data[1].split('\n') if item.strip() != '']
    for city in province_cities:
        city = city.replace("**", "").replace('-', '').strip()
        city_data = city.split('：', 1)
        city_name = city_data[0].strip()
        city_name = re.sub(r'（[0-9]+）', '', city_name)
        print('  '+city_name)

        property_names = city_data[1].strip().split('，')
        for property_name in property_names:
            if '](' in property_name:
                property_name = property_name[1:-1]
                parts = property_name.split('](')
                property_name = parts[0]
                property_image = parts[1].replace('./images/', '')
            else:
                property_image = ''
            
            month_match = re.search(r'（\d+月）', property_name)
            if month_match:
                property_name = re.sub(r'（\d+月）', '', property_name)
                property_month = month_match.group(0)[1:-1]
            else:
                property_month = ''
            print('    '+property_name)

            target_entry = {
                'city': city_name,
                'name': property_name,
            }
            if property_image:
                target_entry['image'] = property_image
            if property_month:
                target_entry['month'] = property_month
            target_data.append(target_entry)
    with open(target_file, 'w') as f:
        json.dump(target_data, f, ensure_ascii=False, indent=2)
        f.write('\n')
