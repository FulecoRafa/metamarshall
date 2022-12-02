import { TxtDecoratorNotImplementedError } from "../errors";
import { IsTxtDecorated } from "./decorator";
import * as fs from "fs";

export function toTxtFile<T extends Object>(path: string, data: T[]): Promise<null> {
    // Check if T is decorated with @Txt
    if (!('_txtProps' in data[0])) {
        throw new TxtDecoratorNotImplementedError(Object.getPrototypeOf(data[0]));
    }

    // Convert T to implementation of IsTxtDecorated
    const cls = data as any as IsTxtDecorated[];

    let props = cls[0]._txtProps;

    return new Promise((resolve, reject) => {
        // Open file
        const stream = fs.createWriteStream(path, {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        })

        // Set event
        stream.on('error', (err) => {
            reject(err);
        })
        .on('finish', () => {
            resolve(null);
        });

        // Write data
        for (let i = 0; i < cls.length; i++) {
            let line = '';
            for (let key in props) {
                let prop = props[key];
                if (prop == null) {
                    continue;
                }
                let value = (cls[i] as any)[key];
                if (prop.dataType === 'number') {
                    value = value.toFixed(prop.size);
                } else {
                    if (prop.padding === 'left') {
                        value = value.padStart(prop.size, prop.emptyChar);
                    } else {
                        value = value.padEnd(prop.size, prop.emptyChar);
                    }
                }
                line += value;
            }
            stream.write(line + '\n');
        }

        stream.end();
    });
}
