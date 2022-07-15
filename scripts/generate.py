# -*- coding: utf-8 -*-

import json
import os
from pathlib import Path

if not os.getcwd().endswith('scripts'):
    os.chdir('scripts')

with open('../data/template.md', 'r') as f:
    template = f.read()

data_path = Path('../data')
data_files = [item for item in data_path.iterdir() if item.is_file() and item.name.endswith('.json')]

overall_generated = {}
count_mapping = {}
overall_count = 0

for data_file in data_files:
    with open(data_file) as f:
        data = json.load(f)

    province_name = str(data_file).split('/')[-1][:-5]
    province_data = {}
    province_count = 0
    for entry in data:
        city = entry['city']
        image = entry.get('image', '')
        month = entry.get('month', '')
        name = entry.get('name', '')
        if month:
            name += '（' + month + '）'
        if image:
            image = './images/' + image
            name = f'[{name}]({image})'
        
        if city not in province_data:
            province_data[city] = {
                'content': [],
                'count': 0
            }
        province_data[city]['content'].append(name)
        province_data[city]['count'] += 1
        province_count += 1
    
    generate = ''
    for city, value in province_data.items():
        generate += f'- **{city}（{value["count"]}）：** '
        generate += '，'.join(value['content'])
        generate += '\n'
    
    if province_name not in overall_generated:
        overall_generated[province_name] = ''
        count_mapping[province_name] = 0
    overall_generated[province_name] += f'## {province_name} [ {province_count} ]\n{generate}'
    count_mapping[province_name] += province_count

count_mapping = dict(sorted(count_mapping.items(), key=lambda item: item[1], reverse=True))
final_generated = ''
for province_name, count in count_mapping.items():
    final_generated += f'{overall_generated[province_name]}\n'
    overall_count += count

template = template.replace(r'%%TOTAL_COUNT%%', str(overall_count))
template = template.replace(r'%%DATA%%', final_generated)
template = template.strip() + '\n'

with open('../README.md', 'w') as f:
    f.write(template)
