export interface GoogleMapFeature {
    featureType?: string
    elementType?: string
    stylers: Record<string, string>[]
}

export const langs = [
    "zh",
    "en"
] as const
export type Lang = typeof langs[number]