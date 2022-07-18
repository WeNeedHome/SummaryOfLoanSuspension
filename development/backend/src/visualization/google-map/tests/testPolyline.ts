import {encodeNum, encodePoint, encodePoints} from "../algos/encodePolyline";
import * as polyline from "polyline";

const points = [
    [32.320591, 117.227219],
    [32.22509949718747, 117.52111162614624],
    [31.975099497187475, 117.70274725814758],
    [31.666082502812525, 117.70274725814758],
    [31.416082502812525, 117.52111162614624],
    [31.320591, 117.227219],
    [31.416082502812525, 116.93332637385377],
    [31.666082502812525, 116.75169074185243],
    [31.975099497187475, 116.75169074185243],
    [32.22509949718747, 116.93332637385377]
]

let lastPoint = [0, 0]
for (let point of points) {
    let curPoint = [point[0] - lastPoint[0], point[1] - lastPoint[1]]
    const resultFromManual = encodePoint(curPoint)
    const resultFromPolyline = polyline.encode([curPoint])
    const equal = resultFromManual === resultFromPolyline
    console.log(resultFromManual, resultFromPolyline, equal)
    lastPoint = curPoint
}
