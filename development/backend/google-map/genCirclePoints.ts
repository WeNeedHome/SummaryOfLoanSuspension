import {Pos} from "../ds/region";
import {PRECISION} from "./const";
import * as polyline from "polyline";
import {polylineEncodeFromPoses} from "./encodePolyline";
import {encode} from "@googlemaps/polyline-codec";
import {USE_ENCODE} from "./ds";

/**
 * 这只是一个粗略的圆圈计算，实际要考虑地球是个椭圆形
 * @param center
 * @param multiplier
 * @param N
 */
export function genCirclePoints(center: Pos, multiplier: number, N = 50): Pos[] {
    return [...Array(N).keys()].map((k) => {
        const theta = k / N * 2 * Math.PI
        const pos = {
            lat: center.lat + Math.cos(theta) * multiplier,
            lng: center.lng + Math.sin(theta) * multiplier
        }
        // console.log({pos})
        return pos
    })
}

export function genCircleDraw(poses: Pos[], useEncode: USE_ENCODE = 'manual') {
    if (useEncode === "none")
        return ['fillcolor:0x00FF0080', 'geodesic:1', 'weight:0', poses.map(point => point.lat + "," + point.lng).join("|")].join('|')

    const pre = 50
    let points: number[][] = poses.map(point => [point.lat, point.lng])
    for (let i = 1; i < 10; i++) {
        console.log(`encode by polyline [${i}]    : `, polyline.encode([points[i]]))
        console.log(`encode by polyline  [0-${i}] : `, polyline.encode(points.slice(0, i)))
    }

    console.log('encode by polyline       : ', polyline.encode(points,))
    console.log("encode by polyline-codesc: ", encode(points,))
    console.log("encode by manual         : ", polylineEncodeFromPoses(poses))
    console.log({points})
    let paramPath = useEncode === 'manual'
        ? polylineEncodeFromPoses(poses)
        : polyline.encode(points, PRECISION)
    return ['fillcolor:0x00FF0080', 'geodesic:1', 'weight:0', "enc:" + encodeURIComponent(paramPath)].join(encodeURIComponent('|'))
}

