import {Lang} from "./ds";
import {encodeFeaturesFromFileToArray} from "./encodeFeatures";
import path from "path";
import {DATA_GENERATED_DIR, FRONTEND_REACT_SRC_DIR} from "../const";
import axios from "axios";
import {GOOGLE_MAP_API_KEY} from "../../frontend/react/src/const";
import {paramsSerializer} from "./utils";
import {createWriteStream} from "fs";

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
    language?: Lang
    region?: string // https://developers.google.com/maps/coverage
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
    outputSuffix?: string
}

export function genMap(props: IGenMap) {
    const format = props.format || "png"
    axios.get(
        "https://maps.googleapis.com/maps/api/staticmap",
        {
            params: {
                key: props.key || GOOGLE_MAP_API_KEY,
                language: props.language || "zh",
                region: props.region || "CN",
                size: props.size || "640x640",
                zoom: props.zoom || 5,
                center: props.center || "BeiJing",
                format,
                style: props.styles || [],
                path: props.path || []
            },
            // 定制自己的serializer，因为style键会重复，但是不能直接用qs.stringify，会转义，google不允许转义，否则style无效
            paramsSerializer,
            // ref: https://stackoverflow.com/a/66204076/9422455
            responseType: "stream"
        }
    )
        .then(res => {
            const fp = path.join(DATA_GENERATED_DIR, `visualization-${props.outputSuffix || "standard"}.${format}`)
            // write image from axios response, ref: https://stackoverflow.com/a/61269447/9422455
            const writer = createWriteStream(fp);
            res.data.pipe(writer)
            console.log("wrote image to file://" + fp)
        })
        .catch(err => {
            console.error({err})
        })
}

