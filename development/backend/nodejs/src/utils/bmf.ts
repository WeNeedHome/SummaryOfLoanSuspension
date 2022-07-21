import fs from "fs";
import path from "path";
import unzipper from "unzipper";

export const getBmfPath = (fp: string): Promise<string> => {
    return new Promise(((resolve, reject) => {
        if (!fs.existsSync(fp)) reject(`not existed file://${fp}`)

        if (fp.endsWith('.zip')) {
            const fd = path.join(path.dirname(fp), path.basename(fp).replace('.zip', ''))

            return fs.createReadStream(fp)
                .pipe(unzipper.Extract({path: fd}))
                .on('close', () => {
                    fp = path.join(fd, 'font.fnt')
                    resolve(fp)
                })
        }
        if (!fp.endsWith('.fnt')) reject('Jimp只支持.fnt后缀的bmf文件')
        resolve(fp)
    }))
}