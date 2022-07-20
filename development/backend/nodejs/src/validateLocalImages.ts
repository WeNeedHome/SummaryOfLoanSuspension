import path from "path"
import {DATA_GENERATED_DIR, IMAGES_DIR} from "./const";
import fs from "fs";
import {walkDirectory} from "./utils/general";
import {Errors} from "./ds/errors";
import {ArgumentParser} from "argparse";
import {Property} from "./v1/ds";
import { PROPERTIES_SOURCE_TYPE } from "./itree/reshape";


/**
 *
 * @param propertiesSourceType: 从哪种停贷数据中读取，目前V1版本生成flat状properties.json文件，V2版本生成tree状properties文件
 */
export function getAllLinks(propertiesSourceType: PROPERTIES_SOURCE_TYPE): string[] {
    const matchUri = (s: string): string => {
        const g = s.match(/"(images.*)"/)
        if (!g) throw new Error(Errors.IMPOSSIBLE + ': ' + s + ', ' + g)
        return g[1]
    }

    switch (propertiesSourceType) {
        case 'flat':
            // 从 properties-flat.json 中读取
            const properties: Property[] = JSON.parse(fs.readFileSync(path.join(DATA_GENERATED_DIR, "properties.json"), "utf-8"))
            return properties.filter(property => property.link).map(property => property.link) as string[]
        case 'tree':
            // 从 properties-tree.json 中读取
            return fs.readFileSync(path.join(DATA_GENERATED_DIR, "properties-tree.json"), "utf-8").split('\n')
                .filter(s => s.includes('images'))
                .map(matchUri)
        default:
            throw new Error(Errors.INVALID_INPUT)
    }
}


/**
 * 检测图片文件夹里的图片是否均已在readme文档中体现
 * 注意：我们约定了如果一个楼盘有多张图片作为支撑材料，则在该省份/城市文件内再新建一个以该楼盘命名的文件夹存放，并加上"_"前缀以示区别，例如`images/广西/桂林/_桂林融创文旅城N4地块`
 */
export function validateImageSource(propertiesSourceType: PROPERTIES_SOURCE_TYPE) {
    const imageLinks = getAllLinks(propertiesSourceType)
    for (let imagePath of walkDirectory(IMAGES_DIR, false, true, (dirName, fileName) => fileName.startsWith("_"))) {
        let imageUri = imagePath.slice(IMAGES_DIR.length - path.basename(IMAGES_DIR).length)
        if (!imageLinks.includes(imageUri))
            errors.push("not included image of file://" + imageUri)
    }

    if (errors.length > 0) {
        for (let error of errors)
            console.error(error)
        throw new Error('failed to validate local images source, qualified image uris are: ' + imageLinks)
    } else {
        console.log('passed local image sources validation √')
    }
}


const parser = new ArgumentParser()
parser.add_argument('-t', '--propertiesSourceType', {
    choices: ['flat', 'tree'],
    default: 'tree',
    help   : "选择停贷数据输入类型，V1版本为flat，V2版本为tree，默认V2"
})
const args = parser.parse_args()

const errors: string[] = []
validateImageSource(args.propertiesSourceType)

