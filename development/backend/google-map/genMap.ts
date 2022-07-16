import axios from "axios";
import dotenv from "dotenv"
import path from "path";
import {FRONTEND_DIR, FRONTEND_SRC_DIR, PROJECT_DIR} from "../const";
import {encodeFeaturesFromFileToArray} from "./encodeFeatures";
import {createWriteStream} from "fs";
import * as fs from "fs";
import {genCircleDraw, genCirclePoints} from "./genCirclePoints";
import {CitiesOnMap} from "../../frontend/src/ds";

// https://stackoverflow.com/a/51727245/9422455
require('axios-debug-log')

dotenv.config({
    path: path.join(FRONTEND_DIR, ".env.local")
})


/**
 * ref: https://developers.google.com/maps/documentation/maps-static/start
 */
export interface IGenMap {
    key?: string
    /**
     * max-size: 640x640, the longer side would be limited
     *   if we wanner bigger image, we can combine it with scale to be 2
     * sample: 512x512
     */
    size?: string
    /**
     * the final output dimension is from `size x scale`
     * default: 1
     */
    scale?: number
    zoom?: number // 12
    center?: string // "Chicago"，应该也可以是经纬度
    format?: string // png
    styles?: string[]
    path?: string[]
}

export function genMap(props: IGenMap) {
    const format = props.format || "png"
    axios.get(
        "https://maps.googleapis.com/maps/api/staticmap",
        {
            params: {
                key: props.key || process.env.REACT_APP_GOOGLE_API_KEY,
                size: props.size || "512x512",
                zoom: props.zoom || 12,
                center: props.center || "BeiJing",
                format,
                style: props.styles || [],
                path: props.path || ""
            },
            // 定制自己的serializer，因为style键会重复，但是不能直接用qs.stringify，会转义，google不允许转义，否则style无效
            paramsSerializer: function (params: Record<string, string | string[]>): string {
                let frags: string[] = []
                Object.entries(params).forEach(([key, val]) => {
                    if (!Array.isArray(val)) {
                        frags.push(key + "=" + val)
                    } else if (val.length) {
                        val.forEach(v => {
                            frags.push(key + "=" + v)
                        })
                    }
                })
                return frags.join("&")
            },
            // ref: https://stackoverflow.com/a/66204076/9422455
            responseType: "stream"
        }
    )
        .then(res => {
            const fp = path.join(PROJECT_DIR, "cities-visualization." + format)
            // write image from axios response, ref: https://stackoverflow.com/a/61269447/9422455
            const writer = createWriteStream(fp);
            res.data.pipe(writer)
            console.log("wrote image to file://" + fp)
        })
        .catch(err => {
            console.error({err})
        })
}


const styles = encodeFeaturesFromFileToArray(path.join(FRONTEND_SRC_DIR, "components/google/theme-dark-simple-2.json"))
const cities: CitiesOnMap = JSON.parse(fs.readFileSync(path.join(FRONTEND_SRC_DIR, "data/cities-for-map.json"), "utf-8"))
const circles = Object.values(cities).slice(0, 2).map(item => genCircleDraw(genCirclePoints(item.pos, 0.5, 10), "polyline"))

genMap({
    center: 'henan',
    size: "640x640",
    scale: 2,
    zoom: 5,
    styles,
    path: circles,
})