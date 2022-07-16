import {invert, twoComplement} from "./math";

/**
 * 对多边形进行编码，已通过测试
 * 而下面的官方参考文档中，七个测例有四个都有问题……
 * polyline算法解释: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 * polyline编解码UI: https://developers.google.com/maps/documentation/utilities/polylineutility
 * @param num
 */
export function encodeNum(num: number): string {

    // step 2: E5
    num *= Math.round(1e5)

    // step 3: to bits
    let bits: string = twoComplement(num)

    // step 4. left shift
    bits = bits.slice(1) + "0"

    // step 5. invert if negative
    if (num < 0)
        bits = invert(bits)

    // step 6. break
    // step 7. reverse
    let bitsR: number[] = []
    let eIndex = bits.length
    while (eIndex >= 5) {
        bitsR.push(parseInt(bits.slice(Math.max(eIndex - 5, 0), eIndex), 2))
        eIndex -= 5
    }

    // step 8. OR
    let endZero = bitsR.length - 1
    while (endZero >= 0 && bitsR[endZero] === 0) endZero -= 1
    for (let i = 0; i < endZero; i++)
        bitsR[i] |= 0x20

    // step 9. to decimal (implicit finished)

    // step 10. to decimal
    bitsR = bitsR.map(num => num + 63)

    // step 11. to ASCII
    return String.fromCharCode(...bitsR)
}

export function encodePoint(point: number[]): string {
    return point
        .map(encodeNum)
        .map(s => s.replace(/\?+$/, '')) // 替换掉末尾全部的? (即0)
        .map(s => s || '?')  // 要保留一个
        .join('')
}

/**
 * 编码多边形时，要用差分
 * @param points
 */
export function encodePoints(points: number[][]): string {
    let result = ''
    let lastPoint = [0, 0]
    points.forEach(point => {
        result += encodePoint([point[0] - lastPoint[0], point[1] - lastPoint[1]])
        lastPoint = point
    })
    return result
}