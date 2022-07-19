import * as fs from "fs";
import {GoogleMapFeature} from "./ds";


function encodeFeature(feature: GoogleMapFeature): string {

    const joinedStyle = (style: Record<string, string>): string => {
        if (Object.keys(style).length !== 1) throw new Error(`length of style record should equal 1, while it is: ${style}`)
        return Object.entries(style).map(([k, v]) => k + ":" + v.replace('#', '0x'))[0]
    }
    let encodes: string[] = []
    if (feature.featureType)
        encodes.push(`feature:${feature.featureType}`)
    if (feature.elementType)
        encodes.push(`element:${feature.elementType}`)
    if (feature.stylers)
        feature.stylers.forEach((style) => {
            encodes.push(joinedStyle(style))
        })
    return encodes.join(encodeURIComponent("|"))
}

export function encodeFeaturesFromFileToString(fp: string): string {
    const features: GoogleMapFeature[] = JSON.parse(fs.readFileSync(
        fp,
        "utf-8"
    ))
    return features.map(feature => "&style=" + encodeFeature(feature)).join("")
}

export function encodeFeaturesFromFileToArray(fp: string): string[] {
    const features: GoogleMapFeature[] = JSON.parse(fs.readFileSync(
        fp,
        "utf-8"
    ))
    return features.map(encodeFeature)
}

