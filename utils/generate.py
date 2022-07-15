#%%
import os
import pandas as pd
import json
case_dir = './cases'
df = pd.DataFrame(columns = ['province', 'prefecture', 'name', 'date', 'link'])
#%%

for item in os.listdir(case_dir):
    case = json.loads(open(os.path.join(case_dir, item), 'r', encoding='utf-8').read())
    df = df.append(case, ignore_index=True)

# %%
provinces = df.province.unique()
print(f'Records Provinces: {provinces}')
#%%
intro = open('asset/intro.md', 'r', encoding='utf-8').read()
with open('Cases.md', 'w', encoding='utf-8') as f:
    f.write(intro)
    f.write(f'# Cases# 总数：【{len(df)}】\n')
    f.write('''

[互帮互助留言讨论区，这里没有人捂嘴](https://github.com/WeNeedHome/SummaryOfLoanSuspension/discussions)


    ''')
    for province in provinces:
        df_province = df[df.province == province]
        f.write(f'## {province} [ {len(df_province)} ]\n')
        prefectures = df_province.prefecture.unique()
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

