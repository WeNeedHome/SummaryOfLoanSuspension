export const depth2Chinese = (k: number): string => {
    switch (k) {
        case 0:
            return '〇'
        case 1:
            return '一'
        case 2:
            return '二'
        default:
            return '三'
    }
}