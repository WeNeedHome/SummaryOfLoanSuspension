import * as fs from "fs";
import path from "path";
import {BACKEND_DIR} from "../const";
import {CountryData} from "./region.ds";
import {Address2PosMap, ICity} from "./ds";

fs.readFile(path.join(BACKEND_DIR, "region/region-tree.json"), 'utf-8', ((err, content) => {
    if (err) throw err

    const data: CountryData = JSON.parse(content)
    const cities: Address2PosMap = {}
    data.districts.forEach((province) => {
        province.districts.forEach((city) => {
            const cityId = province.name + "-" + city.name
            cities[cityId] = city.center
        })
    })

    fs.writeFile(
        path.join(BACKEND_DIR, "region/city2pos.map.json"),
        JSON.stringify(cities, null, 2),
        (err1) => {
            if(err1) throw err1
        }
    )
}))