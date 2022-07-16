/**
 * i.e. `google.maps.LatLngLiteral`
 */
export interface Pos {
    lat: number
    lng: number
}

export interface Address {
    province: string
    city?: string
    district?: string
    pos: Pos
}

export interface AddressWithCount extends Address {
    count: number
}
