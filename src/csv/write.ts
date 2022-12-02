import { IsCsvDecorated } from "./decorator";
import * as fs from 'fs';
import { CsvDecoratorNotImplementedError } from "../errors";

/**
 * Write an array of objects to a CSV file.
 * @param path Name of the file to write to.
 * @param data Array of objects to write to file.
 * @param header If true, the first line of the file will be the header.
 */
export async function toCsvFile<T extends Object>(path: string, data: T[], header = true): Promise<null> {
    // Check if T is decorated with @Csv
    if (!('_csvProps' in data[0]) || !('_csvDelimiter' in data[0])) {
        throw new CsvDecoratorNotImplementedError(Object.getPrototypeOf(data[0]));
    }

    // Convert T to implementation of IsCsvDecorated
    const cls = data as any as IsCsvDecorated[];

    let props = cls[0]._csvProps;
    let delimiter = cls[0]._csvDelimiter;

    let propNames = Object.values(props).map(prop => prop.name);

    return new Promise((resolve, reject) => {
        // Open file
        const stream = fs.createWriteStream(path, {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        // Set event
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('finish', () => {
            resolve(null);
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
                let value = (cls[i] as any)[key];
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

        stream.end();
    });
}
