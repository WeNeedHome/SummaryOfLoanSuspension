export function paramsSerializer(params: Record<string, string | string[]>): string {
    let frags: string[] = []
    Object.entries(params).forEach(([key, val]) => {
        if (!Array.isArray(val)) {
            frags.push(key + "=" + val)
        } else if (val.length) {
            val.forEach(v => {
                frags.push(key + "=" + v)
            })
        }
    })
    return frags.join("&")
}