import { IFlatItem, ITree } from "./ds";
import { Errors } from "../ds/errors";

export const PROPERTIES_SOURCE_TYPE = ['flat', 'tree'] as const
export type PROPERTIES_SOURCE_TYPE = typeof PROPERTIES_SOURCE_TYPE[number]

export const tree2flat = (t: ITree): IFlatItem[] => {
    const f: IFlatItem[] = []
    t.children.forEach(p => {
        p.children.forEach(c => {
            c.children.forEach(i => {
                f.push({
                    name     : i.name,
                    uri      : i.uri,
                    developer: i.developer,
                    city     : c.name,
                    province : p.name
                })
            })
        })
    })
    return f
}

/**
 * todo
 * @param f
 */
export const flat2tree = (f: IFlatItem[]): ITree => {
    throw new Error(Errors.NOT_IMPLEMENTED)
} // choice for development/backend/src/validateLocalImages.ts

