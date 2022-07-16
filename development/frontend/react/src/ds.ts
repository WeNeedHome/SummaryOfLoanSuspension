export type Pos = google.maps.LatLngLiteral

export interface Address {
    province: string
    city?: string
    district?: string
    pos: Pos
}

export interface AddressWithCount extends Address {
    count: number
}

export type CitiesOnMap = Record<string, AddressWithCount>