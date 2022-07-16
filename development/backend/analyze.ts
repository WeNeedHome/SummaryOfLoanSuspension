import fs from "fs";
import path from "path";
import {
    BACKEND_DIR,
    DATA_PROPERTIES_PATH,
    IMAGES_DIR,
    README_PATH
} from "./const";
import {Property} from "./ds/property";
import {getCityNameUnderProvinceImagesDir, getImageUriRobust, getProvinceNameUnderImagesDir} from "./utils/uri";
import {validateImageLink} from "./validateLocalImages";
import {ArgumentParser} from "argparse";
import {Errors} from "./ds/errors";


/**
 * 解析readme文件，检查语法问题，并生成城市停贷数据
 */
function analyze(enableSortProvinces = false) {
    // 一些标志位
    let startCollecting = false
    let isModified = false

    // 用于省份排序输出
    let headingPart = ''
    let provinceKeys: string[] = []
    let provinceVals: string[] = []

    // 收集楼盘
    let collectedProperties: Property[] = []
    let collectedErrors: string[] = []

    // 统计全国
    let markedTotal = 0
    let cumTotal = 0

    // 统计省份
    let curProvince: string
    let provinceDir: string // 省份图片文件夹名
    let markedTotalInProvince = 0
    let cumTotalInProvince = 0
    let countProvinces = 0

    // 统计城市
    let curCity: string
    let cityDir: string | undefined // 城市图片文件夹（目前可能不存在，未来应该要有）
    let markedTotalInCity = 0
    let countCities = 0

    function validateTotal() {
        console.log(`截至目前，总计${countProvinces}个省份，${countCities}个城市，${cumTotal}个楼盘`)
        if (cumTotal !== markedTotal) {
            const msg = `文档中楼盘总计的结果[${markedTotal}]可能错误`
            console.error(msg)
            collectedErrors.push(msg)
        } else {
            console.log(`√ 楼盘合计校验通过！`)
        }
    }

    function validateProvince() {
        // 合并省份计数
        cumTotal += cumTotalInProvince

        // 验证省份统计
        if (cumTotalInProvince !== markedTotalInProvince) {
            const msg = `properties count in province ${curProvince} failed to validate, calculated: ${String(cumTotalInProvince).padStart(3)}, marked: ${String(markedTotalInProvince).padStart(3)}`
            console.error(msg)
            collectedErrors.push(msg)
        }
    }

    function parseLine(line: string) {
        // 标记总数
        const matchTotal = line.match(/总计【(\d+)\+】/)
        const matchProvince = line.match(/### (.*?)\s*\[\s*(\d+)\s*\]/)
        const matchCity = line.match(/^-\s*\*\*(.*?)\s*[（(](\d+)[)）].*?\*\*(.*?)$/)

        function handleProvince(matchProvince: RegExpMatchArray) {
            countProvinces += 1
            if (curProvince) validateProvince() // 后一个省份解析前一个省份

            curProvince = matchProvince[1]
            provinceDir = getProvinceNameUnderImagesDir(curProvince)
            provinceKeys.push(curProvince)
            provinceVals.push("")

            markedTotalInProvince = parseInt(matchProvince[2])
            console.log(`parsing province ${curProvince}`)
            cumTotalInProvince = 0
        }

        function handleCity(matchCity: RegExpMatchArray) {
            countCities += 1
            curCity = matchCity[1]
            cityDir = getCityNameUnderProvinceImagesDir(provinceDir, curCity)
            markedTotalInCity = parseInt(matchCity[2])
            let propertiesInCity = matchCity[3].split(/[，,]/)
            // 验证城市统计
            if (propertiesInCity.length !== markedTotalInCity)
                console.error(`    properties count in city ${curCity} failed to validate, calculated: ${String(propertiesInCity.length).padStart(3)}, marked: ${String(markedTotalInCity).padStart(3)}`)
            cumTotalInProvince += propertiesInCity.length

            propertiesInCity.forEach((propertyStr: string) => {
                let property: Property = {name: "", city: curCity, province: curProvince}
                const matchPropertyLink = propertyStr.match(/\s*\[(.*?)\]\((.*?)\)/)
                if (matchPropertyLink) {
                    property.name = matchPropertyLink[1]

                    // 重新归档到省份文件夹内
                    let parsedLink = matchPropertyLink[2]
                    let parsedLinkFrags = parsedLink.split('/')

                    // 既有可能是单张图片，也可能是一个文件夹
                    let fileName = parsedLinkFrags[parsedLinkFrags.length - 1]
                    let imageUri = getImageUriRobust(provinceDir, cityDir, fileName)
                    let newLink = [path.basename(IMAGES_DIR), imageUri].join('/')
                    validateImageLink(newLink)
                    property.link = newLink
                    if (parsedLink !== newLink) {
                        isModified = true
                        line = line.replace(parsedLink, newLink)
                    }
                } else {
                    property.name = propertyStr.split(" ").join("")
                }
                const matchPropertyMonth = property.name.match(/(.*?)\s*（(\d+)月）/)
                if (matchPropertyMonth) {
                    property.name = matchPropertyMonth[1]
                    property.month = parseInt(matchPropertyMonth[2])
                }

                collectedProperties.push(property)
            })
        }

        // 解析总数
        if (matchTotal)
            markedTotal = parseInt(matchTotal[1])

        // 等待匹配到第一个省份
        if (matchProvince)
            startCollecting = true

        if (!startCollecting) {
            headingPart += line + "\n"
            return
        }

        // 解析省份
        if (matchProvince)
            handleProvince(matchProvince)

        // 解析城市
        if (matchCity)
            handleCity(matchCity)

        // 更新省份下的数据
        provinceVals[provinceVals.length - 1] += line + "\n"
    }

    // parse
    fs.readFileSync(README_PATH, "utf-8").split("\n").forEach(parseLine)
    validateProvince() // 由于最后没有新的省份作为结尾符，所以要再跑一遍
    if (provinceKeys.length !== provinceVals.length) throw new Error(Errors.PROGRAMME_ERROR)
    validateTotal()

    // stop
    if (collectedErrors.length > 0)
        throw new Error(collectedErrors.join('\n'))

    // dump properties data
    const data = JSON.stringify(collectedProperties, null, 2)
    fs.writeFileSync(DATA_PROPERTIES_PATH, data, "utf-8")
    console.log('√ 已写入基于楼盘的停贷数据：file://' + DATA_PROPERTIES_PATH)

    // sort provinces if necessary
    if (enableSortProvinces) {
        isModified = true
        provinceVals = [...Array(provinceKeys.length).keys()]
            // 按拼音排序: https://blog.csdn.net/qq_27674439/article/details/115406758
            .sort((k1, k2) => provinceKeys[k1].localeCompare(provinceKeys[k2], "zh"))
            .map(i => provinceVals[i])
        console.log("√ 按拼音对省份排序")
    }

    // rewrite readme if necessary
    if (isModified) {
        const readmePathBackedUp = path.join(BACKEND_DIR, "tmp/README.md")
        fs.cpSync(README_PATH, readmePathBackedUp)
        console.log('√ 已备份 README：file://' + readmePathBackedUp)
        fs.writeFileSync(README_PATH, [headingPart, provinceVals.join('')].join('\n').replace(/\n{2,9}/g, '\n\n'), 'utf-8')
        console.log("√ 已写入 README：file://" + README_PATH)
    }
}

const parser = new ArgumentParser({
    description: "解析 README 脚本"
})
parser.add_argument('-s', '--sortProvinces', {
    action: 'store_true',
    default: false,
    help: "由于我们已经做好了省份排序，所以这个选项其实属于历史遗留选项，偶尔用一下即可"
})
const args = parser.parse_args()
analyze(args.sortProvinces)