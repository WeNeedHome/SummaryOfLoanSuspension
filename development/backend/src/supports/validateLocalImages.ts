import path from "path"
import {DATA_GENERATED_DIR, IMAGES_DIR, PROJECT_DIR} from "../const";
import fs from "fs";
import {Property} from "../ds/property";
import {walkDirectory} from "../utils/general";
import {Errors} from "../ds/errors";

/**
 * 检测一个图像链接是否能在本地文件夹中找到
 * @param link
 */
export function validateImageLink(link: string): boolean {
    if (!link) throw new Error(Errors.NOT_ALLOW_EMPTY)

    const imagePath = path.join(PROJECT_DIR, link)
    if (!fs.existsSync(imagePath)) throw new Error(Errors.NOT_EXIST + ': ' + link)
    return true
}

export function getAllLinks(): string[] {
    const properties: Property[] = JSON.parse(fs.readFileSync(path.join(DATA_GENERATED_DIR, "properties.json"), "utf-8"))
    return properties.filter(property => property.link).map(property => property.link) as string[]
}


/**
 * 检测图片文件夹里的图片是否均已在readme文档中体现
 * 注意：我们约定了如果一个楼盘有多张图片作为支撑材料，则在该省份/城市文件内再新建一个以该楼盘命名的文件夹存放，并加上"_"前缀以示区别，例如`images/广西/桂林/_桂林融创文旅城N4地块`
 */
export function validateImageSource() {
    const imageLinks = getAllLinks()
    for (let imagePath of walkDirectory(IMAGES_DIR, false, true, (dirName, fileName) => fileName.startsWith("_"))) {
        let imageUri = imagePath.slice(IMAGES_DIR.length - path.basename(IMAGES_DIR).length)
        // console.log(imageUri)
        if (!imageLinks.includes(imageUri)) {
            console.log("not included image uri: " + imageUri)
        }
    }
}
