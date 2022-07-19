import fs from "fs";
import path from "path";

export function assertEqual(a: any, b: any, msg = ''): boolean {
    if (a === b) return true
    if (msg) console.error(msg)
    throw new Error(`NOT_EQUAL: ${a} != ${b}\n`)
}

/**
 * ref: https://stackoverflow.com/a/66083078/9422455
 * @param fromDir
 * @param yieldDirs
 * @param yieldFiles
 * @param treatAsFile: 把文件夹视为文件的依据，比如 _开头的图片文件夹就可以视作文件
 */
export function* walkDirectory(
    fromDir: string,
    yieldDirs: boolean                                                         = true,
    yieldFiles: boolean                                                        = true,
    treatAsFile: ((fromDir: string, entryName: string) => boolean) | undefined = undefined
): Generator<string> {
    if (!fs.existsSync(fromDir)) throw new Error('directory not exist: ' + fromDir)

    for (let file of fs.readdirSync(fromDir, {withFileTypes: true})) {
        const subDir = path.join(fromDir, file.name)
        if (file.isDirectory()) {
            if (yieldDirs || treatAsFile && treatAsFile(fromDir, file.name)) yield subDir
            if (treatAsFile && !treatAsFile(fromDir, file.name))
                yield* walkDirectory(subDir, yieldDirs, yieldFiles, treatAsFile)
        } else {
            if (yieldFiles)
                yield subDir
        }
    }
}
