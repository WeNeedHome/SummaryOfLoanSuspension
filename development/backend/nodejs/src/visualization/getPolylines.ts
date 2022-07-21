import { DATA_VISUALIZATION_PATH } from "../const";
import { drawPath, genCirclePoints } from "./google-map/genCirclePoints";
import { AddressWithCount } from "../../../../frontend/react/src/visualization/ds";

export const getPolylineForCities = (cities: AddressWithCount[]): string[] => {
    console.log('reading cities data from file://' + DATA_VISUALIZATION_PATH)
    return Object.values(cities).map(item => drawPath(genCirclePoints(
        item.pos.lat,                                           // lat
        item.pos.lng,                                           // lng
        50 * Math.log10(item.count + 1),            // distance
        Math.round(20 * Math.log10(item.count + 1))      // degree
    ), true))
}