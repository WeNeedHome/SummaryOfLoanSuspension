import { ITree } from "./ds";
import { checkUriExists } from "../utils/uri";

export const validateITree = (t: ITree) => {
    const errors: string[] = []

    let cumTotal = 0
    t.children.forEach(prov => {

        let cumProvince = 0
        prov.children.forEach(city => {

            city.children.forEach(item => {
                if (item.uri && !checkUriExists(item.uri))
                    errors.push(`uri of ${item.uri} not exists`)
            })
            if (city.count !== city.children.length)
                errors.push(`city of ${city.name} count mismatch, calced: ${city.children.length}, written: ${city.count}`)
            cumProvince += city.children.length
        })
        if (prov.count !== cumProvince)
            errors.push(`province of ${prov.name} count mismatch, calced: ${cumProvince}, written: ${prov.count}`)
        cumTotal += cumProvince
    })
    if (cumTotal !== t.count)
        errors.push(`country count mismatch, calced: ${cumTotal}, written: ${t.count}`)

    if (errors.length > 0) {
        console.error(errors)
        throw new Error('failed to validate')
    }
}