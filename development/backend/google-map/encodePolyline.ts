import {Pos} from "../ds/region";

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

    // implementation 2 (seems right but not):
    // return ((~(-num)) + 1).toString(2).padStart(32, '0')
}

/**
 * 对多边形进行编码，这个算法是我手写的，与官方（后来才发现）的包polyline结果一致
 * 而下面的官方参考文档中，七个测例有四个都有问题，所以还是算了
 * ref: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 * @param num
 */
export function polylineEncodeFromNum(num: number): string {
    // console.log("input: ", num)

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
    // const PRECISION = 1e-8
    // const outputGoogle = polyline.encode([[num]], PRECISION)
    // console.log("output: ", output)
    // console.log('google: ', outputGoogle)
    // console.log('google decode from output: ', polyline.decode(output))
    // console.log('google decode from encode: ', polyline.decode(outputGoogle))
    return output
}

export function polylineEncodeFromPos(pos: Pos): string {
    return polylineEncodeFromNum(pos.lat) + polylineEncodeFromNum(pos.lng)
}

export function polylineEncodeFromPoses(poses: Pos[]): string {
    return poses.map(polylineEncodeFromPos).join('')
}