import * as path from "path";
import * as fs from "fs";
import {README_PATH} from "../../const";
import {City, Property, Province} from "./ds";

async function analyze() {
    fs.readFile(README_PATH, "utf-8", ((err, content) => {
        if (err) throw err

        let startCollecting = false
        let provinces: Province[] = []
        let province: Province
        let markedTotalInProvince = 0
        let markedTotalInCity = 0
        let city: City

        content.split("\n").forEach((line: string) => {
            const matchProvince = line.match(/## (.*?) \[ (\d+) \]/)
            // 等待匹配到第一个省份
            if (matchProvince)
                startCollecting = true
            if (!startCollecting)
                return

            // 解析省份
            if (matchProvince) {
                // console.log({matchProvince})
                province = {name: matchProvince[1], cities: []}
                markedTotalInProvince = parseInt(matchProvince[2])
                // console.log(`parsing province ${province.name}`)
                return;
            }

            // 解析城市
            const matchCity = line.match(/^-\s*\*\*(.*?)\s*[（(](\d+)[)）].*?\*\*(.*?)$/)
            if (matchCity) {
                // console.log({matchCity})
                city = {name: matchCity[1], properties: []}
                markedTotalInCity = parseInt(matchCity[2])
                let propertiesStr = matchCity[3]
                propertiesStr.split("，").forEach((propertyStr: string) => {
                    // console.log({propertyStr})
                    let property: Property = {name: ""}
                    const matchPropertyLink = propertyStr.match(/\s*\[(.*?)\]\((.*?)\)/)
                    if (matchPropertyLink) {
                        property.name = matchPropertyLink[1]
                        property.link = matchPropertyLink[2]
                    } else {
                        property.name = propertyStr.split(" ").join("")
                    }
                    const matchPropertyMonth = property.name.match(/(.*?)\s*（(\d+)月）/)
                    if (matchPropertyMonth) {
                        property.name = matchPropertyMonth[1]
                        property.month = parseInt(matchPropertyMonth[2])
                    }

                    city.properties.push(property)
                })
                // 验证城市统计
                if (city.properties.length !== markedTotalInCity)
                    console.error(`    properties count in city ${city.name} failed to validate, calculated: ${String(city.properties.length).padStart(3)}, marked: ${String(markedTotalInCity).padStart(3)}`)
                province.cities.push(city)

            } else {
                // 验证省份统计
                const calcTotalInProvince = province.cities.reduce((u: number, city) => u + city.properties.length, 0)
                if (calcTotalInProvince !== markedTotalInProvince) {
                    console.error(`properties count in province ${province.name} failed to validate, calculated: ${String(calcTotalInProvince).padStart(3)}, marked: ${String(markedTotalInProvince).padStart(3)}`)
                }
                provinces.push(province)
            }
        })

        const data = JSON.stringify(provinces, null, 2)
        fs.writeFile(path.join(__dirname, "region-tree.json"), data, (err) => {
            if (err) throw err
        })
    }))
}

analyze()