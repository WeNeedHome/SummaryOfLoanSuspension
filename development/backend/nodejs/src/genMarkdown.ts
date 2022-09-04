import fs from "fs";
import { ArgumentParser } from "argparse";

import { PROPERTIES_TREE_PATH, REG_END_DEVELOPER, REG_START } from "./const";

import { depth2Chinese } from "./utils/conversion";
import { Errors } from "./ds/errors";
import { IItem, ITree } from "./itree/ds";
import { SORT_BY, SORT_BY_DICT_CN, sortITree } from "./itree/sort";
import { getPathRobust } from "./utils/uri";

export enum MdProvinceStyle {
    raw,
    fakeLine, // 书写时换行，显示时拼起来
}


export const formatProvince = (style: MdProvinceStyle, provinceName: string, provinceCount: number): string => {
    return `\n### ${provinceName} [ ${provinceCount} ]\n\n`
}

export const formatCity = (style: MdProvinceStyle, cityName: string, cityCount: number): string => {
    switch (style) {
        case MdProvinceStyle.fakeLine:
            return `- **${cityName}（${cityCount}）：** `
        case MdProvinceStyle.raw:
            return `#### ${cityName} (${cityCount})\n`
        default:
            throw new Error(Errors.NOT_IMPLEMENTED)
    }
}

export const formatItem = (style: MdProvinceStyle, item: IItem, index: number, items: IItem[]): string => {
    const itemStandardStr = item.uri ? `[${item.name}](${item.uri})` : item.name
    switch (style) {
        case MdProvinceStyle.raw:
            return `${itemStandardStr}, `
        case MdProvinceStyle.fakeLine:
            return `\n  ${itemStandardStr}` + (index < items?.length - 1 ? ',' : '')
        default:
            throw new Error(Errors.NOT_IMPLEMENTED)
    }
}

export const genPropertiesMd = (style: MdProvinceStyle, sourcePath: string, targetPath: string, sortBy: SORT_BY, sortDepth: number, joinReadmePath: string) => {
    const readLines = () => {
        let developerDic: {[dev: string]: string[]} = {};
        propertiesTree.children.map((prov) => {
            // add province node
            writer += formatProvince(style, prov.name, prov.count)

            // 解析城市
            prov.children.forEach((city) => {
                writer += formatCity(style, city.name, city.count)

                // 解析项目
                city.children.forEach((item, index, items) => {
                    writer += formatItem(style, item, index, items)
                    if (item.developer.length > 0) {
                        if (developerDic[item.developer] == null) {
                            developerDic[item.developer] = []
                        }
                        developerDic[item.developer].push(`${prov.name}-${city.name}-${item.name}`)
                    }
                })

                // 最后一个项目之后再补一行（因为本身不换行）
                writer += '\n'
            })
        })
        console.log('finished writing items')

        var total = 0
        var developerDetails = ""
        Object.entries(developerDic).sort(([n1, ], [n2, ]) => n1.localeCompare(n2, 'zh')).forEach(([key, value]) => {
            developerDetails += "<details>\n"
            developerDetails += `<summary><b> ${key} 【${value.length}】</b></summary>\n`
            developerDetails += `  ${value.join(",<br>\n  ")}\n`
            developerDetails += "</details>\n"
            total += value.length
        });
        writer += `\n## 开发商总计 ${Object.entries(developerDic).length}（按拼音排序）（统计楼盘数 ${total}）[数据源](data/source/extra-info.json)\n`
        writer += developerDetails
        console.log('finished writing developers')
    }

    let propertiesTree: ITree = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'))
    console.log(`read properties tree from file://${sourcePath}`)

    propertiesTree = sortITree(propertiesTree, sortBy, sortDepth)
    console.log(`sorted properties tree by ${sortBy} with depth of ${sortDepth}`)

    let writer: string = `## 分省数据 (总计：【**${propertiesTree.count}+**】，按${depth2Chinese(sortDepth)}级${SORT_BY_DICT_CN[sortBy]}）\n`
    readLines()

    if (joinReadmePath) {
        const linesRaw              = fs.readFileSync(getPathRobust(joinReadmePath), 'utf-8').split('\n')
        const linesBefore: string[] = []
        const linesAfter: string[]  = []
        let isStarted               = false
        let isEnded                 = false
        for (let line of linesRaw) {
            if (isStarted && REG_END_DEVELOPER.test(line)) isEnded = true
            if (REG_START.test(line)) isStarted = true
            if (!isStarted) linesBefore.push(line)
            if (isEnded) linesAfter.push(line)
        }
        writer = [linesBefore.join('\n'), writer, linesAfter.join('\n')].join('\n')
        console.log('joined with raw markdown')
    }

    if (targetPath) {
        fs.writeFileSync(getPathRobust(targetPath), writer, 'utf-8')
        console.log(`wrote properties data into file://${getPathRobust(targetPath)}`)
    }
}


const parser = new ArgumentParser({
    description: '将 JSON 格式的停贷数据转成 markdown 格式'
})
parser.add_argument('-s', '--sourcePath', {
    default: PROPERTIES_TREE_PATH,
    help   : '输入的JSON格式的停贷数据文件位置'
})
parser.add_argument('-t', '--targetPath', {
    help: '输出的MARKDOWN格式的停贷数据文件位置，注意由于图片链接都是相对位置，所以默认情况下只有输出到根目录才有效'
})
parser.add_argument('-b', '--sortBy', {
    choices: [...SORT_BY], default: 'count',
    help   : '排序依据，即按拼音升序或者按数量降序'
})
parser.add_argument('-d', '--sortDepth', {
    type   : 'int',
    default: 3,
    help   : '排序深度，即省 -> 市 -> 项目，排到哪一级'
})
parser.add_argument('-j', '--joinReadmePath', {
    help: '是否将排序输出后的文件与当前的markdown文件拼接起来'
})

const args = parser.parse_args()

const curMdProvinceStyle = MdProvinceStyle.fakeLine
genPropertiesMd(curMdProvinceStyle, args.sourcePath, args.targetPath, args.sortBy, args.sortDepth, args.joinReadmePath)
