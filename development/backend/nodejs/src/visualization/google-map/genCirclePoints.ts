import * as polyline from "polyline";
import {getGeoFrom} from "./algos/geo";

/**
 *
 * @param lat
 * @param lng
 * @param distance: km
 * @param totalPoints: points count
 */
export function genCirclePoints(lat: number, lng: number, distance: number, totalPoints = 4): number[][] {
    return [...Array(totalPoints).keys()].map((k) =>
        getGeoFrom(lat, lng, distance, k / totalPoints * 360)
    )
}

export function drawPath(points: number[][], useEncode = true) {
    const color = '0xDD000050'
    return useEncode
        ? ['fillcolor:' + color, 'geodesic:1', 'weight:0', "enc:" + polyline.encode(points)].join(encodeURIComponent('|'))
        : ['fillcolor:' + color, 'geodesic:1', 'weight:0', points.map(point => point.join(',')).join("|")].join('|')
}

