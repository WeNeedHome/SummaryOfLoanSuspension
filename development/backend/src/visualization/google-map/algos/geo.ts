
/**
 * ref: https://stackoverflow.com/a/51765950/9422455
 * @param latitude
 * @param longitude
 * @param distance: 单位: km
 * @param degree: 角度（0-360）
 */
export function getGeoFrom(latitude, longitude, distance, degree): number[] {

    const R = 6378.1; // Radius of the Earth
    const brng = degree * Math.PI / 180; // Convert bearing to radian
    let lat = latitude * Math.PI / 180; // Current coords to radians
    let lon = longitude * Math.PI / 180;

    // Do the math magic
    lat = Math.asin(Math.sin(lat) * Math.cos(distance / R) + Math.cos(lat) * Math.sin(distance / R) * Math.cos(brng));
    lon += Math.atan2(Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat), Math.cos(distance / R) - Math.sin(lat) * Math.sin(lat));

    // Coords back to degrees and return
    return [(lat * 180 / Math.PI), (lon * 180 / Math.PI)];

}