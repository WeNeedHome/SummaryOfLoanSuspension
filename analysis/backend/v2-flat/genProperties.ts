import * as fs from "fs";
import path from "path";
import {README_PATH} from "../const";
import {Property} from "./ds";

async function analyze() {
    fs.readFile(README_PATH, "utf-8", ((err, content) => {
        if (err) throw err

        let startCollecting = false
        let properties: Property[] = []
        let province: string
        let city: string

        let markedTotalInProvince = 0
        let cumTotalInProvince = 0
        let markedTotalInCity = 0

        content.split("\n").forEach((line: string) => {
            const matchProvince = line.match(/## (.*?)\s*\[\s*(\d+)\s*\]/)
            // 等待匹配到第一个省份
            if (matchProvince)
                startCollecting = true
            if (!startCollecting)
                return

            // 解析省份
            if (matchProvince) {
                // console.log({matchProvince})
                province = matchProvince[1]
                markedTotalInProvince = parseInt(matchProvince[2])
                // console.log(`parsing province ${province}`)
                cumTotalInProvince = 0
                return;
            }

            // 解析城市
            const matchCity = line.match(/^-\s*\*\*(.*?)\s*[（(](\d+)[)）].*?\*\*(.*?)$/)
            if (matchCity) {
                // console.log({matchCity})
                city = matchCity[1]
                markedTotalInCity = parseInt(matchCity[2])
                let propertiesInCity = matchCity[3].split("，")
                // 验证城市统计
                if (propertiesInCity.length !== markedTotalInCity)
                    console.error(`    properties count in city ${city} failed to validate, calculated: ${String(propertiesInCity.length).padStart(3)}, marked: ${String(markedTotalInCity).padStart(3)}`)
                cumTotalInProvince += propertiesInCity.length

                propertiesInCity.forEach((propertyStr: string) => {
                    // console.log({propertyStr})
                    let property: Property = {name: "", city, province}
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

                    properties.push(property)
                })


            } else {
                // 验证省份统计
                if (cumTotalInProvince !== markedTotalInProvince) {
                    console.error(`properties count in province ${province} failed to validate, calculated: ${String(cumTotalInProvince).padStart(3)}, marked: ${String(markedTotalInProvince).padStart(3)}`)
                }
            }
        })

        const data = JSON.stringify(properties, null, 2)
        fs.writeFile(path.join(__dirname, "properties.json"), data, (err) => {
            if (err) throw err
        })
    }))
}

analyze()