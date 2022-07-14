import {Pos} from "../region/region.ds";

export interface Property {
    province: string
    city: string
    name: string
    link?: string
    month?: number
}

export interface ICityOnMap {
    id: string
    count: number
    pos: Pos
}

export type CitiesOnMap = Record<string, ICityOnMap>