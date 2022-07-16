export function assertEqual(a: any, b: any) {
    console.log('target: ', b)
    if (a != b) {
        console.error(`NOT_EQUAL: ${a} != ${b}\n`)
    } else {
        console.log("√\n")
    }
}