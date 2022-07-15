export interface Property {
    name: string
    link?: string
    month?: number
}

export interface City {
    name: string
    properties: Property[]
}

export interface Province {
    name: string
    cities: City[]
}