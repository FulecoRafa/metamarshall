import { IsCsvDecorated } from "./decor";
import * as fs from 'fs';

export function toCsvFile<T extends Object>(clsAny: T[], fileName: string, header = true) {
    // Check if T is decorated with @Csv
    if (!('_csvProps' in clsAny[0]) || !('_csvDelimiter' in clsAny[0])) {
        throw new Error('Class must be decorated with @Csv');
    }

    // Convert T to implementation of IsCsvDecorated
    const cls = clsAny as any as IsCsvDecorated[];

    let props = cls[0]._csvProps;
    let delimiter = cls[0]._csvDelimiter;

    let propNames = Object.values(props).map(prop => prop.name);

    // Open file
    const stream = fs.createWriteStream(fileName, {
        flags: 'w',
        encoding: 'utf8',
        autoClose: true
    });

    // Write header
    if (header) {
        let headerStr = propNames.join(delimiter);
        stream.write(headerStr + '\n');
    }

    // Write data
    for (let i = 0; i < cls.length; i++) {
        let line = '';
        for (let key in props) {
            let prop = props[key];
            if (prop == null) {
                continue;
            }
            console.log(key, prop);
            let value = cls[i][key];
            if (prop.fixedWidth > 0) {
                if (prop.dataType === 'number') {
                    value = value.toFixed(prop.fixedWidth);
                } else {
                    if (prop.padding === 'left') {
                        value = value.padStart(prop.fixedWidth, ' ');
                    } else {
                        value = value.padEnd(prop.fixedWidth, ' ');
                    }
                }
            }
            if (prop.quoted) {
                value = `"${value}"`;
            }
            line += value + delimiter;
        }
        stream.write(line.slice(0, -1) + '\n');
    }
}
