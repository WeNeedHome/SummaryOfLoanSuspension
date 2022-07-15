import {Pos} from "../region/region.ds";
import polyline from 'polyline'

/**
 * 这只是一个粗略的圆圈计算，实际要考虑地球是个椭圆形
 * @param center
 * @param multiplier
 * @param N
 */
export function genCirclePoints(center: Pos, multiplier: number, N = 50): Pos[] {
    const unit = 360 / N
    return [...Array(N).keys()].map((k) => {
        const theta = unit * k
        return {
            lat: center.lat + Math.cos(theta) * multiplier,
            lng: center.lng + Math.sin(theta) * multiplier
        }
    })
}

export function invert(s: string): string {
    return s.replace(/[01]/g, c => c === '1' ? '0' : '1')
}

export function twoComplement(num: number): string {

    if (num >= 0) return num.toString(2).padStart(32, '0').slice(0, 32)

    // implementation 1:
    // raw
    let s: string = (-num).toString(2).padStart(32, '0').slice(0, 32)
    // invert
    s = invert(s)
    // add
    return (parseInt(s, 2) + 1).toString(2).padStart(32, '0').slice(0, 32)

    // implementation 2:
    // return ((~(-num)) + 1).toString(2).padStart(32, '0')
}

export function encodePolylineAlgo(num: number): string {
    console.log("input: ", num)

    // step 2: E5
    num *= 1e5
    num = Math.round(num)
    // console.log("E5: ", num)

    // step 3: to bits
    let bits: string = twoComplement(num)
    // bits = bits.padStart(Math.ceil(bits.length / 8) * 8, "0") // padding to 8 base
    // console.log("binary: ", bits)

    // step 4. left shift
    bits = bits.slice(1) + "0"
    // console.log("shift:   ", bits)

    // step 5. invert if negative
    if (num < 0) {
        bits = invert(bits)
        // console.log('invert:  ', bits)
    }

    // step 6. break
    // step 7. reverse
    let bitsR: number[] = []
    let eIndex = bits.length
    while (eIndex >= 5) {
        bitsR.push(parseInt(bits.slice(Math.max(eIndex - 5, 0), eIndex), 2))
        eIndex -= 5
    }
    // console.log("rev: ", bitsR.map(n => n.toString(2).padStart(5, '0')))

    // step 8. OR
    let endZero = bitsR.length - 1
    while (endZero >= 0 && bitsR[endZero] === 0) endZero -= 1
    for (let i = 0; i < endZero; i++)
        bitsR[i] |= 0x20
    // console.log("OR:  ", bitsR.map(n => n.toString(2).padStart(5, '0')))
    // step 9. to decimal (implicit finished)

    // step 10. to decimal
    bitsR = bitsR.map(num => num + 63)
    // console.log("add: ", bitsR.map(n => n.toString(2).padStart(5, '0')))
    // step 11. to ASCII
    let output = String.fromCharCode(...bitsR)
    const PRECISION = 1e-8
    const outputGoogle = polyline.encode([[num]], PRECISION)
    console.log("output: ", output)
    console.log('google: ', outputGoogle)
    console.log('google decode from output: ', polyline.decode(output))
    console.log('google decode from encode: ', polyline.decode(outputGoogle))
    return output
}

export function genCircleDraw(points: Pos[]) {
    return `fillcolor:0x00FF0080|geodesic:1|weight:0|`
        + points.map(point => point.lat + "," + point.lng).join("|")
}


export function assertEqual(a: any, b: any) {
    console.log('target: ', b)
    if (a != b) {
        console.error(`NOT_EQUAL: ${a} != ${b}\n`)
    } else {
        console.log("√\n")
    }
}


assertEqual(encodePolylineAlgo(-179.9832104), '`~oia@')
assertEqual(encodePolylineAlgo(38.5), '_p~iF',)
assertEqual(encodePolylineAlgo(-120.2), '~ps|U',)
assertEqual(encodePolylineAlgo(40.7), '_ulL')
assertEqual(encodePolylineAlgo(-120.95), 'nnqC')
assertEqual(encodePolylineAlgo(43.252), '_mqN')
assertEqual(encodePolylineAlgo(-126.453), 'vxq`@')