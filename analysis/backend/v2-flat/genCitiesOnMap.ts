import * as fs from "fs";
import path from "path";
import {ICityOnMap, Property} from "./ds";
import {BACKEND_DIR, FRONTEND_SRC_DATA_DIR} from "../const";
import {Address2PosMap} from "../region/ds";

const city2PosMap: Address2PosMap = JSON.parse(fs.readFileSync(path.join(BACKEND_DIR, "region/city2pos.map.json"), "utf-8"))

fs.readFile(
    path.join(__dirname, "properties.json"),
    "utf-8",
    ((err, data) => {
        if (err) throw err

        const properties: Property[] = JSON.parse(data)
        const citiesOnMap: Record<string, ICityOnMap> = {}

        properties.forEach(property => {
            const id = property.province + "-" + property.city
            if (Object.keys(citiesOnMap).includes(id)) {
                (citiesOnMap[id] as ICityOnMap).count += 1
            } else {
                citiesOnMap[id] = {
                    id,
                    count: 1,
                    pos: city2PosMap[id]
                }
            }
        })

        fs.writeFile(
            path.join(FRONTEND_SRC_DATA_DIR, "citiesOnMap.json"),
            JSON.stringify(citiesOnMap, null, 2),
            (err1 => {
                if (err1) throw err1
            })
        )
    })
)