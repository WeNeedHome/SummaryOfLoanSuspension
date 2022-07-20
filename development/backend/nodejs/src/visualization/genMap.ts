import path from "path";
import fs from "fs";
import axios from "axios";
import { ArgumentParser } from "argparse";

import { GOOGLE_MAP_API_KEY } from "../../../../frontend/react/src/visualization/const";
import { AddressWithCount } from "../../../../frontend/react/src/visualization/ds";

import { DATA_CONFIG_GOOGLE_THEME_PATH, DATA_GENERATED_DIR, DATA_VISUALIZATION_PATH } from "../const";
import { Errors } from "../ds/errors";

import { Lang } from "./google-map/ds";
import { encodeFeaturesFromFileToArray } from "./google-map/encodeFeatures";
import { paramsSerializer } from "./google-map/utils";
import { drawPath, genCirclePoints } from "./google-map/genCirclePoints";
import Jimp from 'jimp'


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
}

export const getPolylineForCities = (): string[] => {
    console.log('reading cities data from file://' + DATA_VISUALIZATION_PATH)
    return Object.values(cities).map(item => drawPath(genCirclePoints(
        item.pos.lat,                                           // lat
        item.pos.lng,                                           // lng
        50 * Math.log10(item.count + 1),            // distance
        Math.round(20 * Math.log10(item.count + 1))      // degree
    ), true))
}


export function genMap(props: IGenMap) {
    let style: string[] = []
    if (props.themeName) {
        const themePath = path.join(DATA_CONFIG_GOOGLE_THEME_PATH, props.themeName)
        if (!fs.existsSync(themePath)) throw new Error(Errors.NOT_EXIST)
        style = encodeFeaturesFromFileToArray(themePath)
        console.log('generating theme of ' + props.themeName)
    } else {
        console.log(`generating theme of 'standard' since no themeName input`)
    }

    const format = props.format || 'png'

    axios.get(
        "https://maps.googleapis.com/maps/api/staticmap",
        {
            params      : {
                key     : props.key || GOOGLE_MAP_API_KEY,
                language: props.language || "zh",
                region  : props.region || "CN",
                size    : props.size || "640x640",
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
                    console.log("wrote image to file://" + fp)
                    // TODO: Jimp只支持bitmap格式.fnt结尾的字体，我费了很长时间都没搞定一份可以用的。。有人看到了帮个忙呗，希望能用中文写我们的声明
                    // 只有黑色主题才需要白色字体
                    const font  = await Jimp.loadFont(props.themeName?.includes('dark') ? Jimp.FONT_SANS_16_WHITE : Jimp.FONT_SANS_16_BLACK);
                    // read image: https://github.com/oliver-moran/jimp/tree/master/packages/jimp
                    const image = await Jimp.read(fp);

                    [
                        `[${new Date().toLocaleDateString()}] ${totalCities} cities, ${totalProperties} projects`,
                        'https://github.com/WeNeedHome/SummaryOfLoanSuspension',
                    ]
                        .forEach((s, i) => {
                            image.print(font, 10, 30 + i * 20, s)
                        })
                    await image.write(fp2)
                    console.log('wrote image to file://' + fp2)
                })

        })
        .catch(err => {
            console.error({err})
        })
}


const availableGoogleThemes: string[] = fs.readdirSync(DATA_CONFIG_GOOGLE_THEME_PATH)
const cities: AddressWithCount[]      = JSON.parse(fs.readFileSync(DATA_VISUALIZATION_PATH, "utf-8"))
const polylineForCities               = getPolylineForCities()
const totalCities                     = cities.length
const totalProperties                 = cities.reduce((p, c) => p + c.count, 0)


const parser = new ArgumentParser({
    description: "generate static map image"
})
parser.add_argument('-t', '--themeName', {choices: ['all', ...availableGoogleThemes]})
const args = parser.parse_args()

const themeName = args.themeName
if (themeName === 'all') {
    console.log('generating all themes including: ' + availableGoogleThemes)
    availableGoogleThemes.forEach((themeName) => {genMap({themeName})})
} else {
    genMap({themeName})
}
