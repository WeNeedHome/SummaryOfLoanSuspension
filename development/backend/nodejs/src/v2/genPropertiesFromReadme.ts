import fs from "fs";
import path from "path";

import {
    DATA_GENERATED_DIR,
    ITEM_SEP,
    README_PATH,
    REG_CITY,
    REG_END,
    REG_ITEM,
    REG_PROV,
    REG_START,
    REG_TOTAL
} from "../const";
import { IFlatItem, IItem, INode } from "../itree/ds";

const collectProv = () => curData.children.push(curProv)
const collectCity = () => curProv.children.push(curCity)
const collectItem = () => {
    curCity.children.push(curItem)
    flatItems.push({...curItem, province: curProv.name, city: curCity.name})
}

/**
 * 提取：省份名，省内数量
 * @param line
 */
const parseProvLine = (line: string): string => {
    // 非首次匹配，则回收上一个省份
    if (curProv.name) collectProv()

    let matched = line.match(REG_PROV) as RegExpMatchArray
    curProv     = {name: matched[1], count: parseInt(matched[2]), children: []}
    // console.log('parsing province: ' + curProv.name) # since we have powerful error track, the log is unnecessary now
    return line
}

/**
 * 提取：城市名，市内数量，项目们
 * @param line
 */
const parseCityLine = (line: string): string => {
    /**
     * 拆分 -> 【处理 + 变换（格式化文档时需要）】 -> 合并
     * @param itemsStr
     */
    const parseItems  = (itemsStr: string): string => {
        return itemsStr
            .split(ITEM_SEP)
            .map(itemStr => {
                let matched = itemStr.match(REG_ITEM) as RegExpMatchArray
                curItem     = matched[3]
                    ? {name: matched[3], uri: ''}
                    : {name: matched[1], uri: matched[2]}
                collectItem()
                return itemStr
            })
            .join(ITEM_SEP)
    }
    let matched       = line.match(REG_CITY) as RegExpMatchArray
    curCity           = {name: matched[1], count: parseInt(matched[2]), children: []}
    const itemsStrRaw = matched[3]
    const itemsStrNew = parseItems(itemsStrRaw)
    collectCity()
    if (curCity.count !== curCity.children.length)
        console.error(line, curCity)

    return line.replace(itemsStrRaw, itemsStrNew)
}

/**
 * 逐行解析README文档
 * @param line
 */
const parseLine = (line: string): string => {

    // 这句话可以独立运行，反正只会匹配到一次，与程序状态无关
    if (REG_TOTAL.test(line))
        curData.count = parseInt((line.match(REG_TOTAL) as RegExpMatchArray)[1])

    // 开始匹配是结束匹配的子集，所以需要率先对结束匹配做一些限定
    if (isStarted && REG_END.test(line)) {
        if (!isEnded) collectProv()
        isEnded = true
    }
    if (REG_START.test(line)) isStarted = true

    // 开始匹配
    if (isStarted && !isEnded) {
        // 解析省份
        if (REG_PROV.test(line)) line = parseProvLine(line)

        // 解析城市
        if (REG_CITY.test(line)) line = parseCityLine(line)
    }
    return line
}

const validate = () => {
    let totalCalced   = 0,
        totalMarked   = curData.count,
        errors: any[] = []

    // validate province
    curData.children.forEach((prov: INode) => {
        let provName        = prov.name,
            provTotalMarked = prov.count,
            provTotalCalced = 0

        // validate city
        prov.children.forEach((city: INode) => {
            let cityName        = city.name,
                cityTotalCalced = city.children.length,
                cityTotalMarked = city.count

            provTotalCalced += cityTotalCalced
            if (cityTotalCalced !== cityTotalMarked)
                errors.push({cityName, cityTotalMarked, cityTotalCalced})

        })

        totalCalced += provTotalCalced
        if (provTotalCalced !== provTotalMarked)
            errors.push({provName, provTotalMarked, provTotalCalced})
    })

    // validate country
    if (totalMarked !== totalCalced)
        errors = [{totalMarked, totalCalced}, ...errors]

    // 倒序打印所有报错，并中止程序
    if (errors.length > 0) {
        for (let i = errors.length - 1; i >= 0; i--)
            console.error(errors[i])
        // console.log(curData)
        throw new Error(`failed to validate with ${errors.length} errors!`)
    }
}

/**
 * 存储结构化停贷数据
 */
const writeSuspensionData = () => {
    const PROPERTIES_TREE_PATH = path.join(DATA_GENERATED_DIR, "properties-tree.json")
    fs.writeFileSync(PROPERTIES_TREE_PATH, JSON.stringify(curData, null, 2), 'utf-8')
    console.log('wrote properties data into file://' + PROPERTIES_TREE_PATH)

    const PROPERTIES_FLAT_PATH = path.join(DATA_GENERATED_DIR, "properties-flat.json")
    fs.writeFileSync(PROPERTIES_FLAT_PATH, JSON.stringify(flatItems, null, 2), 'utf-8')
    console.log('wrote properties data into file://' + PROPERTIES_FLAT_PATH)
}


/**
 * 重新序列化README文档
 */
const rewriteReadmeFile = () => {
    const BACKUP_README_PATH = README_PATH + '.bak'
    fs.cpSync(README_PATH, BACKUP_README_PATH)
    console.log("backed up README (since rewriting) into file://" + BACKUP_README_PATH)

    fs.writeFileSync(README_PATH, contentNew, 'utf-8')
    console.log('rewrote README (since changed) into file://' + README_PATH)
}


let isStarted = false
let isEnded   = false

const curData: INode         = {name: '中华人民共和国', count: 0, children: []}
let curProv: INode           = {name: '', count: 0, children: []}
let curCity: INode           = {name: '', count: 0, children: []}
let curItem: IItem           = {name: '', uri: ''}
const flatItems: IFlatItem[] = []

const contentRaw = fs.readFileSync(README_PATH, 'utf-8')
const contentNew = contentRaw.split('\n').map(parseLine).join('\n')

validate()                      // 验证文档是否正确解析，如无，则报错，阻止后续的写入操作
writeSuspensionData()           // 输出树状的停贷数据
if (contentNew !== contentRaw)  // no change, no rewrite
    rewriteReadmeFile()         // 如果重组后的内容有变动，则重新生成一份 readme 文档
console.log('finished √')
