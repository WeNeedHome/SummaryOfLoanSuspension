import * as fs from "fs";
import path from "path";
import {BACKEND_DIR, IMAGES_DIR, README_PATH} from "../const";
import {Property} from "./ds";
import {read} from "fs";

let provinceNamesUnderImagesDir = fs.readdirSync(IMAGES_DIR, {withFileTypes: true})
    .filter(d => d.isDirectory())
    .map(d => d.name)

function getProvinceNameUnderImagesDir(inputProvinceName: string): string {
    for (let provinceNameUnderImagesDir of provinceNamesUnderImagesDir) {
        if (inputProvinceName.includes(provinceNameUnderImagesDir))
            return provinceNameUnderImagesDir
    }
    console.warn(`province dir of ${inputProvinceName} not exists, creating...`)
    fs.mkdirSync(path.join(IMAGES_DIR, inputProvinceName))
    return inputProvinceName
}

function getCityNameUnderProvinceImagesDir(provinceDir: string, inputCityName: string): string | undefined {
    for (let cityNameUnderProvinceImagesDir of fs.readdirSync(path.join(IMAGES_DIR, provinceDir))) {
        if (inputCityName.includes(cityNameUnderProvinceImagesDir))
            return cityNameUnderProvinceImagesDir
    }
    // console.error(`not find a proper city name under province images dir ${provinceDir} for ${inputCityName}`)
}

function getImageUriRobust(provinceDir: string, cityDir: string | undefined, fileName: string): string | undefined {
    let imgUri = path.join(provinceDir, fileName)
    if (fs.existsSync(path.join(IMAGES_DIR, imgUri)))
        return imgUri
    if (cityDir) {
        imgUri = path.join(provinceDir, cityDir, fileName)
        if (!fs.existsSync(path.join(IMAGES_DIR, imgUri)))
            console.error(`not found image uri of ${imgUri}`)
        return imgUri
    }
}

function analyze() {
    let startCollecting = false
    let isModified = false
    let newReadme = ""

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
                if (curProvince) validateProvince() // 后一个省份解析前一个省份

                curProvince = matchProvince[1]
                provinceDir = getProvinceNameUnderImagesDir(curProvince)

                markedTotalInProvince = parseInt(matchProvince[2])
                console.log(`parsing province ${curProvince}`)
                cumTotalInProvince = 0
            }

            // 解析城市
            else if (matchCity) {
                countCities += 1
                curCity = matchCity[1]
                cityDir = getCityNameUnderProvinceImagesDir(provinceDir, curCity)
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
                        let parsedLinkFrags = parsedLink.split('/')

                        let fileName = parsedLinkFrags[parsedLinkFrags.length - 1]
                            || property.name // 有时候链接只有一个光秃秃的省份，所以用名字去匹配
                        let imageUri = getImageUriRobust(provinceDir, cityDir, fileName)
                        let newLink = [path.basename(IMAGES_DIR), imageUri].join('/')
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
    if (isModified) {
        const readmePathBackedUp = path.join(BACKEND_DIR, "tmp/README.md")
        console.log('backup README.md to ' + readmePathBackedUp)
        fs.cpSync(README_PATH, readmePathBackedUp)
        console.log('rewriting README.md')
        fs.writeFileSync(README_PATH, newReadme, 'utf-8')
    }
}

analyze()