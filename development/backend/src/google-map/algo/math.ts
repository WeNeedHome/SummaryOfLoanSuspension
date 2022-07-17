export function invert(s: string): string {
    return s.replace(/[01]/g, c => c === '1' ? '0' : '1')
}

export function twoComplement(num: number): string {


    if (num >= 0) return num.toString(2).padStart(32, '0').slice(0, 32)

    // implementation 1:
    // step 1. raw
    let s: string = (-num).toString(2).padStart(32, '0').slice(0, 32)
    // step 2. invert
    s = invert(s)
    // step 3. add
    return (parseInt(s, 2) + 1).toString(2).padStart(32, '0').slice(0, 32)

    // implementation 2 (seems right but not):
    // return ((~(-num)) + 1).toString(2).padStart(32, '0')
}