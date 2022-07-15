#%%
import os
import pandas as pd
import json
outfile = 'README.md'
case_dir = './cases'
df = pd.DataFrame(columns = ['province', 'prefecture', 'name', 'date', 'link'])
#%%

for item in os.listdir(case_dir):
    case = json.loads(open(os.path.join(case_dir, item), 'r', encoding='utf-8').read())
    df = df.append(case, ignore_index=True)

# %%
provinces = df.province.unique()
print(f'Records Provinces: {provinces}')
# Manual desinate the provinces order
provinces = ['江西省','河南省','湖北省','山西省', '湖南省', '辽宁省', '江苏省', '陕西省',
'广西壮族自治区', '河北省', '吉林省', '云南省', '广东省', '重庆市', '山东省', '福建省',
'安徽省', '四川省', '甘肃省', '上海市', '天津市', '贵州省', '北京市', '内蒙古自治区', '浙江省']
#%%
intro = open('asset/intro.md', 'r', encoding='utf-8').read()
with open(outfile, 'w', encoding='utf-8') as f:
    f.write(intro)
    f.write(f'\n# Cases# 总数：【{len(df)}+】\n')
    f.write('''

<br/>

[互帮互助留言讨论区=>](https://github.com/WeNeedHome/SummaryOfLoanSuspension/discussions)

## 其他数据公示处
```
项目发起人：被ban了

我来文档：https://www.wolai.com/xutejcDgz9B3aTcrRCjxB1

Notion数据库：https://www.notion.so/21dab14200e2478eb91c49b68d16495f
```

''')
    for province in provinces:
        df_province = df[df.province == province]
        f.write(f'## {province} [ {len(df_province)} ]\n')
        prefectures = df_province.prefecture.unique()
        print(f'Province {province} has {prefectures}')
        for prefecture in prefectures:
            df_prefecture = df_province[df_province.prefecture == prefecture]
            f.write(f'- **{prefecture}（{len(df_prefecture)}）：** ')
            line_raw = ''
            for index, row in df_prefecture.iterrows():
                name = row['name']
                if row.date is not None:
                    name += row.date
                if row.link is not None:
                    line_raw += f'[{name}]({row.link})，'
                else:
                    line_raw += f'{name}，'
            f.write(line_raw[:-1]+'\n')
        f.write('\n')
