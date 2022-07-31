import path from "path";
import fs from "fs";
import axios from "axios";
import Jimp from 'jimp'
import { ArgumentParser } from "argparse";

import { GOOGLE_MAP_API_KEY } from "../../../../frontend/react/src/visualization/const";
import { AddressWithCount } from "../../../../frontend/react/src/visualization/ds";

import {
    BMF_FOOTER_PATH,
    BMF_TITLE_BLACK_PATH,
    BMF_TITLE_RED_STROKE_PATH,
    BMF_TITLE_WHITE_PATH,
    DATA_CONFIG_GOOGLE_THEME_DIR,
    DATA_GENERATED_DIR,
    DATA_VISUALIZATION_PATH
} from "../const";
import { Errors } from "../ds/errors";

import { Lang } from "./google-map/ds";
import { encodeFeaturesFromFileToArray } from "./google-map/encodeFeatures";
import { paramsSerializer } from "./google-map/utils";
import { getPolylineForCities } from "./getPolylines";
import { getBmfPath } from "../utils/bmf";


/**
 * ref: https://developers.google.com/maps/documentation/maps-static/start
 */
export interface IGenMap {
    key?: string
    language?: Lang
    region?: string // https://developers.google.com/maps/coverage
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
    path?: string[]
    themeName?: string
    fontPath?: string
}

export function genMap(props: IGenMap) {
    let style: string[] = []
    if (props.themeName) {
        const themePath = path.join(DATA_CONFIG_GOOGLE_THEME_DIR, props.themeName)
        if (!fs.existsSync(themePath)) throw new Error(Errors.NOT_EXIST)
        style = encodeFeaturesFromFileToArray(themePath)
        console.log('generating theme of ' + props.themeName)
    } else {
        console.log(`generating theme of 'standard' since no themeName input`)
    }

    const format          = props.format || 'png'
    const size            = props.size || '640x640'
    const [width, height] = size.split('x').map(x => parseInt(x))
    axios.get(
        "https://maps.googleapis.com/maps/api/staticmap",
        {
            params      : {
                key     : props.key || GOOGLE_MAP_API_KEY,
                language: props.language || "zh",
                region  : props.region || "CN",
                size,
                center  : props.center || '33,113', // the best coordinate to radiate country with zoom = 5
                zoom    : props.zoom || 5,
                path    : props.path || polylineForCities,
                format,
                style,
            },
            paramsSerializer, // 定制自己的serializer，因为style键会重复，但是不能直接用qs.stringify，会转义，google不允许转义，否则style无效
            responseType: "stream" // dump axios response to image, ref: https://stackoverflow.com/a/61269447/9422455
        }
    )
        .then(res => {
            const fp  = path.join(DATA_GENERATED_DIR, `visualization-${props.themeName?.replace('.json', '') || 'standard'}.${format}`)
            const fp2 = fp.replace('.png', '-wwm.png')
            res.data.pipe(fs.createWriteStream(fp))
                .on('finish', async () => {
                    console.log("wrote raw       image to file://" + fp)

                    const image = await Jimp.read(fp); // read image: https://github.com/oliver-moran/jimp/tree/master/packages/jimp

                    // title
                    image.print(await Jimp.loadFont(await getBmfPath(BMF_TITLE_RED_STROKE_PATH)),
                        10, 20, '全国停贷地图')

                    // sub-title
                    image.print(
                        await Jimp.loadFont(await getBmfPath(props.themeName?.includes('dark') ? BMF_TITLE_WHITE_PATH : BMF_TITLE_BLACK_PATH)), // 只有黑色主题才需要白色字体
                        10, 50, `截至${new Date().toLocaleDateString()}，已涉及${totalCities} 城市, ${totalProperties} 楼盘`
                    )

                    // footer
                    image.print(await Jimp.loadFont(await getBmfPath(BMF_FOOTER_PATH)),
                        153, height - 24/*footer-size*/ - 2, '开源地址：https://github.com/WeNeedHome')

                    await image.write(fp2)
                    console.log('wrote watermarked image to file://' + fp2)
                })

        })
        .catch(err => {
            console.error({err})
        })
}


const availableGoogleThemes: string[] = fs.readdirSync(DATA_CONFIG_GOOGLE_THEME_DIR)
const cities: AddressWithCount[]      = JSON.parse(fs.readFileSync(DATA_VISUALIZATION_PATH, "utf-8"))
const polylineForCities               = getPolylineForCities(cities)
const totalCities                     = cities.length
const totalProperties                 = cities.reduce((p, c) => p + c.count, 0)


const parser = new ArgumentParser({
    description: "generate static map image"
})
parser.add_argument('-t', '--themeName', {choices: ['all', ...availableGoogleThemes]})
parser.add_argument('--fontPath')
const args = parser.parse_args()

const themeName = args.themeName
if (themeName === 'all') {
    console.log('generating all themes including: ' + availableGoogleThemes)
    availableGoogleThemes.forEach((themeName) => {genMap({themeName, fontPath: args.fontPath})})
} else {
    genMap({themeName, fontPath: args.fontPath})
}
