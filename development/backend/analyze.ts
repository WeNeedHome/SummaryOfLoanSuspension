import * as fs from "fs";
import path from "path";
import {BACKEND_DIR, DATA_GENERATED_DIR, IMAGES_DIR, README_PATH} from "./const";
import {Property} from "./ds/property";
import {getCityNameUnderProvinceImagesDir, getImageUriRobust, getProvinceNameUnderImagesDir} from "./utils/uri";

/**
 * 解析readme文件，检查语法问题，并生成城市停贷数据
 */
function analyze() {
    let startCollecting = false

    // 用于省份排序输出
    let headingPart = ''
    let provinceDict = new Map<string, string>()

    // 收集楼盘
    let collectedProperties: Property[] = []

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
            console.error(`文档中楼盘总计的结果[${markedTotal}]可能错误`)
        } else {
            console.log(`楼盘合计校验通过！`)
        }
    }

    function validateProvince() {
        // 合并省份计数
        cumTotal += cumTotalInProvince

        // 验证省份统计
        if (cumTotalInProvince !== markedTotalInProvince) {
            console.error(`properties count in province ${curProvince} failed to validate, calculated: ${String(cumTotalInProvince).padStart(3)}, marked: ${String(markedTotalInProvince).padStart(3)}`)
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
            provinceDict[curProvince] = ""

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

                    let fileName = parsedLinkFrags[parsedLinkFrags.length - 1]
                        || property.name // 有时候链接只有一个光秃秃的省份，所以用名字去匹配
                    let imageUri = getImageUriRobust(provinceDir, cityDir, fileName)
                    let newLink = [path.basename(IMAGES_DIR), imageUri].join('/')
                    property.link = newLink
                    if (parsedLink !== newLink)
                        line = line.replace(parsedLink, newLink)
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
        provinceDict[curProvince] += line + '\n'
    }

    // parse
    fs.readFileSync(README_PATH, "utf-8").split("\n").forEach(parseLine)
    validateProvince() // 由于最后没有新的省份作为结尾符，所以要再跑一遍
    validateTotal()

    // dump
    const data = JSON.stringify(collectedProperties, null, 2)
    fs.writeFileSync(path.join(DATA_GENERATED_DIR, "properties.json"), data, "utf-8")

    // rewrite
    const readmePathBackedUp = path.join(BACKEND_DIR, "tmp/README.md")
    console.log('备份 README 到 file://' + readmePathBackedUp)
    fs.cpSync(README_PATH, readmePathBackedUp)
    // 按拼音排序，ref: https://blog.csdn.net/qq_27674439/article/details/115406758
    console.log("按拼音对省份排序然后重新写入readme, file://" + README_PATH)
    let provinceKeys = Object.keys(provinceDict).sort((word1, word2) => word1.localeCompare(word2, 'zh'))
    let provincesPart = provinceKeys.map(k => provinceDict[k]).join('\n')
    fs.writeFileSync(README_PATH, [headingPart, provincesPart].join('\n').replace(/\n{2,9}/g, '\n\n'), 'utf-8')
}

analyze()