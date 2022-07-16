export interface GoogleMapFeature {
    featureType?: string
    elementType?: string
    stylers: Record<string, string>[]
}

export const USE_ENCODE = ["none", 'manual', 'polyline'] as const
export type USE_ENCODE = typeof USE_ENCODE[number]