import path from "path";
import fs from "fs";
import {IMAGES_DIR, PROJECT_DIR} from "../const";
import {Errors} from "../ds/errors";

export const provinceNamesUnderImagesDir = fs.readdirSync(IMAGES_DIR, {withFileTypes: true})
    .filter(d => d.isDirectory())
    .map(d => d.name)

export function getProvinceNameUnderImagesDir(inputProvinceName: string): string {
    for (let provinceNameUnderImagesDir of provinceNamesUnderImagesDir) {
        if (inputProvinceName.includes(provinceNameUnderImagesDir))
            return provinceNameUnderImagesDir
    }
    console.warn(`province dir of ${inputProvinceName} not exists, creating...`)
    fs.mkdirSync(path.join(IMAGES_DIR, inputProvinceName))
    return inputProvinceName
}

export function getCityNameUnderProvinceImagesDir(provinceDir: string, inputCityName: string): string | undefined {
    for (let cityNameUnderProvinceImagesDir of fs.readdirSync(path.join(IMAGES_DIR, provinceDir))) {
        if (inputCityName.includes(cityNameUnderProvinceImagesDir))
            return cityNameUnderProvinceImagesDir
    }
    // console.error(`not find a proper city name under province images dir ${provinceDir} for ${inputCityName}`)
}

export function getImageUriRobust(provinceDir: string, cityDir: string | undefined, fileName: string): string | undefined {
    let imgUri = path.join(provinceDir, fileName)
    if (fs.existsSync(path.join(IMAGES_DIR, imgUri)))
        return imgUri
    if (cityDir) {
        imgUri = path.join(provinceDir, cityDir, fileName)
        if (fs.existsSync(path.join(IMAGES_DIR, imgUri)))
            return imgUri
    }
    throw new Error(`not found image from ${imgUri}`)
}

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