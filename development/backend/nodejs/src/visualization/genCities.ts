import * as fs from "fs";
import path from "path";
import {DATA_GENERATED_DIR} from "../const";
import regionTree from "../../../../../data/source/region-tree.json"
import {Address, AddressWithCount} from "../../../../frontend/react/src/visualization/ds";
import {Property} from "../v1/ds";


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

const propertiesPath = path.join(DATA_GENERATED_DIR, "properties-flat.json")
console.log('reading data from file://' + propertiesPath)
const data = fs.readFileSync(propertiesPath, "utf-8")
const properties: Property[] = JSON.parse(data)
const cities: Record<string, AddressWithCount> = {}

properties.forEach(property => {
    const id = property.province + "-" + property.city
    if (Object.keys(cities).includes(id))
        cities[id].count += 1
    else
        cities[id] = {...getAddress(property.province, property.city), count: 1}
})

const citiesForVisualizationPath = path.join(DATA_GENERATED_DIR, "cities-for-visualization.json")
console.log('writing data into file://' + citiesForVisualizationPath)
fs.writeFileSync(citiesForVisualizationPath, JSON.stringify(Object.values(cities), null, 2), "utf-8")

