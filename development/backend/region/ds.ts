import {Pos} from "./region.ds";

export interface ICity {
    province: string
    city: string
    pos: Pos
}


export type Address2PosMap = Record<string, Pos>