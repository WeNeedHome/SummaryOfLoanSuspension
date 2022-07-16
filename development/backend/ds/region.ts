export interface Pos {
    lat: number
    lng: number
}

export type RegionLevel =
    "country" |
    "province" |
    "city" |
    "district"

export interface RegionData {
    name: string
    center: Pos
    level: RegionLevel
    districts: RegionData[]
}

export interface DistrictData extends RegionData {
    level: "district"
    districts: []
}

export interface CityData extends RegionData {
    level: "city"
    districts: DistrictData[]
}

export interface ProvinceData extends RegionData {
    level: "province"
    districts: CityData[] | DistrictData[]
}

export interface CountryData extends RegionData {
    level: "country"
    districts: ProvinceData[]
}
