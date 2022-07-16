import * as fs from "fs";
import path from "path";
import {Property} from "./ds";
import {FRONTEND_SRC_DATA_DIR, GEN_DATA_DIR} from "./const";
import regionTree from "../../data/generated/region.json"
import {Address, AddressWithCount} from "../frontend/react/src/ds";


export function getAddress(province_: string, city_: string): Address {
    const id_ = province_ + "-" + city_
    for (const provinceItem of regionTree.districts) {
        const province = provinceItem.name
        if (province_.includes(province) || province.includes(province_)) {
            // 二级查找
            for (const cityItem of provinceItem.districts) {
                const city = cityItem.name
                if (city.includes(city_) || city_.includes(city)) {
                    return {province, city, pos: cityItem.center}
                }
            }

            // 三级查找
            for (const cityItem of provinceItem.districts) {
                const city = cityItem.name
                for (const districtItem of cityItem.districts) {
                    const district = districtItem.name
                    if (district.includes(city_) || city_.includes(district)) {
                        return {province, city, district, pos: districtItem.center}
                    }
                }
            }
        }
    }
    throw new Error(`not found for ${id_}`)
}


fs.readFile(
    path.join(GEN_DATA_DIR, "properties.json"),
    "utf-8",
    ((err, data) => {
        if (err) throw err

        const properties: Property[] = JSON.parse(data)
        const citiesOnMap: Record<string, AddressWithCount> = {}

        properties.forEach(property => {
            const id = property.province + "-" + property.city
            if (Object.keys(citiesOnMap).includes(id)) {
                citiesOnMap[id].count += 1
            } else {
                citiesOnMap[id] = {...getAddress(property.province, property.city), count: 1}
            }
        })

        fs.writeFile(
            path.join(GEN_DATA_DIR, "citiesOnMap.json"),
            JSON.stringify(citiesOnMap, null, 2),
            (err1 => {
                if (err1) throw err1
            })
        )
    })
)