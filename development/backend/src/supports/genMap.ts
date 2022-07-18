import * as fs from "fs";
import {ArgumentParser} from "argparse";

import {DATA_CONFIG_DIR, DATA_VISUALIZATION_PATH, FRONTEND_REACT_SRC_DIR,} from "../const";
import {drawPath, genCirclePoints} from "../google-map/genCirclePoints";
import {AddressWithCount} from "../../../frontend/react/src/ds";
import {genMap} from "../google-map/genGoogleMap";
import {encodeFeaturesFromFileToArray} from "../google-map/encodeFeatures";
import path from "path";

require('axios-debug-log') // to debug, enable `DEBUG=axios`, ref: https://stackoverflow.com/a/51727245/9422455

const cities: AddressWithCount[] = JSON.parse(fs.readFileSync(DATA_VISUALIZATION_PATH, "utf-8"))
const polyline = Object.values(cities)
    .map(item => drawPath(genCirclePoints(item.pos.lat, item.pos.lng, 50 * Math.log10(item.count + 1), Math.round(20 * Math.log10(item.count + 1))), true))


const parser = new ArgumentParser({
    description: "generate static map image"
})
parser.add_argument('-t', '--theme', {choices: fs.readdirSync(DATA_CONFIG_DIR)})

const args = parser.parse_args()
const styles = args.theme ? encodeFeaturesFromFileToArray(path.join(DATA_CONFIG_DIR, args.theme)) : undefined

genMap({
    language: "zh",
    region: "CN",
    center: '33,113',   // 比较合适的地图中心位置
    zoom: 5,            // 比较合适的放缩级别（正好显示整个中国）
    size: "640x640",    // 最大640x640
    scale: 2,           // 可以缩放2倍
    styles,             // 主题
    path: polyline,     // 绘制
    outputSuffix: args.theme && args.theme.split(".")[0].split("-").pop()
})