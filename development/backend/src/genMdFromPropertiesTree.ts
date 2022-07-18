import fs from "fs";
import {ArgumentParser} from "argparse";

import {PROPERTIES_TREE_PATH, README_PATH, REG_END, REG_START} from "./const";

import {ITree, SORT_BY} from "./ds/property";
import {depth2Chinese} from "./utils/conversion";
import {formatItemLine} from "./utils/format";
import {sortTree} from "./algos/node";


export const genPropertiesMd = (sourcePath: string, targetPath: string, sortBy: SORT_BY, sortDepth: number, joinMarkdown: boolean) => {
    const readLines = () => {
        propertiesTree.children.map((prov) => {
            // add province node
            lines.push(`### ${prov.name} (${prov.count})\n`)

            // 解析城市
            prov.children.forEach((city) => {
                lines.push(`#### ${city.name} (${city.count})\n`)

                // 解析项目
                city.children.forEach((item, index) => {
                    lines.push(`${index + 1}. ${formatItemLine(item)}`)
                })

                // 最后一个项目之后再补一个空行（因为本身不换行）
                lines.push('')
            })
        })
        console.log('finished reading lines')
    }

    let propertiesTree: ITree = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'))
    console.log(`read properties tree from file://${sourcePath}`)

    propertiesTree = sortTree(propertiesTree, sortBy, sortDepth)
    console.log(`sorted properties tree by ${sortBy} with depth of ${sortDepth}`)

    const lines: string[] = [`## 分省数据 (总计：${propertiesTree.count}+，按${depth2Chinese(sortDepth)}级${sortBy}）\n`]
    readLines()
    let content = lines.join('\n')

    if (joinMarkdown) {
        const linesRaw              = fs.readFileSync(README_PATH, 'utf-8').split('\n')
        const linesBefore: string[] = []
        const linesAfter: string[]  = []
        let isStarted               = false
        let isEnded                 = false
        for (let line of linesRaw) {
            if (REG_START.test(line)) isStarted = true
            if (REG_END.test(line)) isEnded = true
            if (!isStarted) linesBefore.push(line)
            if (isEnded) linesAfter.push(line)
        }
        content = [linesBefore.join('\n'), content, linesAfter.join('\n')].join('\n')
        console.log('joined with raw markdown')
    }

    fs.writeFileSync(targetPath, content, 'utf-8')
    console.log(`wrote properties data into file://${targetPath}`)
}


const parser = new ArgumentParser({description: '将 JSON 格式的停贷数据转成 markdown 格式'})
parser.add_argument('-s', '--sourcePath', {
    default: PROPERTIES_TREE_PATH,
    help   : '输入的JSON格式的停贷数据文件位置'
})
parser.add_argument('-t', '--targetPath', {
    default: README_PATH.replace('.md', '-by-lines.md'),
    help   : '输出的MARKDOWN格式的停贷数据文件位置，注意由于图片链接都是相对位置，所以默认情况下只有输出到根目录才有效'
})
parser.add_argument('-b', '--sortBy', {
    choices: Object.values(SORT_BY), default: SORT_BY.pronunciation,
    help   : '排序依据，即按拼音升序或者按数量降序'
})
parser.add_argument('-d', '--sortDepth', {
    type   : 'int',
    default: 3,
    help   : '排序深度，即省 -> 市 -> 项目，排到哪一级'
})
parser.add_argument('-j', '--joinMarkdown', {
    action: 'store_true',
    help  : '是否将排序输出后的文件与当前的markdown文件拼接起来'
})

const args = parser.parse_args()
genPropertiesMd(args.sourcePath, args.targetPath, args.sortBy, args.sortDepth, args.joinMarkdown)
