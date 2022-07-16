import * as fs from "fs";
import path from "path";
import {BACKEND_DIR, IMAGES_DIR, README_PATH} from "../const";
import {Property} from "./ds";

let provinceNamesUnderImagesDir = fs.readdirSync(IMAGES_DIR, {withFileTypes: true})
    .filter(d => d.isDirectory())
    .map(d => d.name)

function getProvinceNameUnderImagesDir(inputProvinceName: string): string {
    for (let provinceNameUnderImagesDir of provinceNamesUnderImagesDir) {
        if (inputProvinceName.includes(provinceNameUnderImagesDir))
            return provinceNameUnderImagesDir
    }
    throw new Error(`not find a proper province name under images dir for ${inputProvinceName}`)
}

function analyze() {
    let startCollecting = false
    let newReadme = ""

    // 收集楼盘
    let collectedProperties: Property[] = []

    // 统计全国
    let markedTotal = 0
    let cumTotal = 0

    // 统计省份
    let curProvince: string
    let markedTotalInProvince = 0
    let cumTotalInProvince = 0
    let countProvinces = 0

    // 统计城市
    let curCity: string
    let markedTotalInCity = 0
    let countCities = 0

    function validateTotal() {
        console.log(`总计${countProvinces}个省份，${countCities}个城市，${cumTotal}个楼盘`)
        if (cumTotal !== markedTotal) {
            console.error(`文档中楼盘总计的结果（${cumTotal}）可能错误`)
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
        if (matchTotal)
            markedTotal = parseInt(matchTotal[1])

        const matchProvince = line.match(/### (.*?)\s*\[\s*(\d+)\s*\]/)
        const matchCity = line.match(/^-\s*\*\*(.*?)\s*[（(](\d+)[)）].*?\*\*(.*?)$/)
        // 等待匹配到第一个省份
        if (matchProvince)
            startCollecting = true
        if (startCollecting) {

            // 解析省份
            if (matchProvince) {
                countProvinces += 1
                if (curProvince) validateProvince()

                curProvince = matchProvince[1]
                markedTotalInProvince = parseInt(matchProvince[2])
                console.log(`parsing province ${curProvince}`)
                cumTotalInProvince = 0
            }

            // 解析城市
            else if (matchCity) {
                countCities += 1
                curCity = matchCity[1]
                markedTotalInCity = parseInt(matchCity[2])
                let propertiesInCity = matchCity[3].split("，")
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
                        let newLink = parsedLink
                        if (newLink.startsWith('.')) newLink = newLink.slice(2)
                        let imageDir, fileName;
                        let provinceDir = curProvince
                        if (newLink.split('/').length === 2)
                            [imageDir, fileName] = newLink.split('/')
                        if (newLink.split('/').length === 3)
                            [imageDir, provinceDir, fileName] = newLink.split('/')
                        newLink = [imageDir, getProvinceNameUnderImagesDir(provinceDir), fileName].join('/')
                        property.link = newLink
                        const linkEqual = parsedLink === newLink
                        if (!linkEqual) console.log({parsedLink, newLink, linkEqual})
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
        }

        newReadme += line + '\n'
    }

    // parse
    fs.readFileSync(README_PATH, "utf-8").split("\n").forEach(parseLine)
    validateProvince() // 由于最后没有新的省份作为结尾符，所以要再跑一遍
    validateTotal()

    // dump
    const data = JSON.stringify(collectedProperties, null, 2)
    fs.writeFileSync(path.join(__dirname, "properties.json"), data, "utf-8")

    // rewrite
    fs.writeFileSync(path.join(BACKEND_DIR, "tmp/README.md"), newReadme, 'utf-8')
}

analyze()