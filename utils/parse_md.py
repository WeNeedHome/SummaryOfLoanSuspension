from base64 import encode
import re, json
city_match = re.compile(r'- \*\*.*（.*\*\*')
month_match = re.compile(r'（.*月）')
link_match = re.compile(r'\(.*images/.*\)')
name_match = re.compile(r'\[.*\]')


with open('README.md', 'r', encoding="utf-8") as f:
    lines = f.readlines()


def sep_month_name(line):
    month = month_match.search(line)
    if month:
        return month.group(0)[1:-1], line[:line.find('（')]
    else:
        return None, line

def get_link(line):
    link = link_match.search(line)
    if link is not None:
        return link.group(0)[1:-1]
    else:
        return None

def get_name(line):
    name_link = name_match.search(line)
    if name_link is not None:
        return name_link.group(0)[1:-1]
    else:
        return line

def get_city(line):
    city = city_raw[0].split('（')[0].split('**')[1]
    num = int(city_raw[0].split('（')[1].split('）')[0])
    return city, num

cases_raw = lines[48:]
province = ""
city = ""
case_name = ""
for case_raw in cases_raw:
    if case_raw.startswith('## '):
        # new province
        province = case_raw.split(' ')[1]
    elif case_raw.startswith('- **'):
        city_raw = city_match.findall(case_raw)
        city, num = get_city(city_raw)
        if len(city_raw) > 0:
            cases = case_raw.split('**')[2].strip().split('，')
            print(cases)
            for case in cases:
                link = get_link(case)
                name = get_name(case)
                month, name = sep_month_name(name)
                case_dict = {
                    'province': province,
                    'prefecture': city,
                    'name': name,
                    'date': month,
                    'link': link
                }
                print(case_dict)
                with open(f'./cases/{province}_{city}_{name}.json', 'w', encoding='UTF-8') as f:
                    f.write(json.dumps(case_dict,  ensure_ascii=False) + '\n')