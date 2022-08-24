import fs from "fs";
import {
    PROJECT_DIR,
    PROPERTIES_FLAT_PATH,
    PROPERTIES_TREE_PATH,
    README_PATH,
    REG_CITY,
    REG_END,
    REG_ITEM_WITH_URI,
    REG_PROV,
    REG_START,
    REG_TOTAL
} from "./const";
import { ITree } from "./itree/ds";
import { validateITree } from "./itree/validate";
import { tree2flat } from "./itree/reshape";
import { ArgumentParser } from "argparse";
import extraInfo from "../../../../data/source/extra-info.json";
import path from "path";


const parseItem = (s: string) => {
    s = s.replace(/\s+/g, '')
    if (!s) return; // no string to parse

    // 首先确保要有一个city
    if (tree.children.length === 0) return; // no provinces
    let curProv = tree.children[tree.children.length - 1]; // curProv
    if (curProv.children.length === 0) return; // no cities
    let curCity = curProv.children[curProv.children.length - 1]; // curCity

    s.split(',')
        .forEach(s2 => {
            s2 = s2.replace(/\s+/g, '')
            if (!s2) return; // no string to parse

            var name = s2;
            var uri = '';
            var developer = '';
            const mItemWithUri = s2.match(REG_ITEM_WITH_URI)
            if (mItemWithUri) {
                name = mItemWithUri[1];
                uri = mItemWithUri[2];
            }
            let extraInfoKey = curProv.name + '-' + curCity.name + '-' + name.split('（')[0];
            if (extraInfo[extraInfoKey] != null) {
                developer = extraInfo[extraInfoKey]['developer']
            }
            curCity.children.push({name, uri, developer});
        })
}

/**
 * 引入正向状态机机制，因此不需要回收，代码逻辑将更简洁
 * @param line
 */
const parseLine = (line: string) => {
    let mTotal = line.match(REG_TOTAL),
        mProv  = line.match(REG_PROV),
        mCity  = line.match(REG_CITY);

    if (mTotal)
        tree.count = parseInt(mTotal[1])

    if (isStarted && REG_END.test(line))
        isFinished = true

    if (isFinished)
        return;

    if (!isStarted)
        if (REG_START.test(line))
            isStarted = true
        else
            return;

    // 省份（单行）
    if (mProv)
        tree.children.push({name: mProv[1], count: parseInt(mProv[2]), children: []})
    // 城市（原版：和楼盘连一起；新版：单行）
    else if (mCity) {
        tree.children[tree.children.length - 1] // curProvince
            .children.push({name: mCity[1], count: parseInt(mCity[2]), children: []})
        if (mCity[3]) parseItem(mCity[3])
    }
    // 可能是空行，或者是楼盘的换行，不管怎样，都可以解析为楼盘，没数据就不操作呗
    else
        parseItem(line)
}

export const genProperties = (readmeFilePath: string) => {
    if (!readmeFilePath.startsWith('/'))
        readmeFilePath = path.join(PROJECT_DIR, readmeFilePath)
    console.log('reading readme from file://' + readmeFilePath)
    fs.readFileSync(readmeFilePath, 'utf-8').split('\n').forEach(parseLine)
    validateITree(tree)
    console.log('passed validation √')

    fs.writeFileSync(PROPERTIES_TREE_PATH, JSON.stringify(tree, undefined, 2), 'utf-8')
    console.log('wrote tree-shape properties data into file://' + PROPERTIES_TREE_PATH)
    fs.writeFileSync(PROPERTIES_FLAT_PATH, JSON.stringify(tree2flat(tree), undefined, 2), 'utf-8')
    console.log('wrote flat-shape properties data into file://' + PROPERTIES_FLAT_PATH)
}


let tree: ITree = {name: '中华人民共和国', count: 0, children: []},
    isStarted   = false,
    isFinished  = false

const parser = new ArgumentParser()
parser.add_argument('-f', '--readmeFilePath', {default: README_PATH})
const args = parser.parse_args()
genProperties(args.readmeFilePath)
