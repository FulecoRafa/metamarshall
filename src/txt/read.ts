import { TxtDecoratorNotImplementedError } from "../errors";
import { IsTxtDecorated, TxtPropsConfig } from "./decorator";
import * as fs from "fs";
import * as readline from "readline";

export async function fromTxtFile<T>(path: string, type: (new () => T)): Promise<T[]> {
    const dummy = new type();

    //check if T is decorated with @Csv
    if (!('_txtProps' in (dummy as Object))) {
        throw new TxtDecoratorNotImplementedError(type);
    }

    //convert T to implementation of IsCsvDecorated
    const cls = dummy as any as IsTxtDecorated;

    // Props is [key, TxtPropsConfig][]. Type not specified because it's not supported by Typescript.
    let props = Object.keys(cls._txtProps)
        .map(key => [key, cls._txtProps[key]]);

    return new Promise((resolve, reject) => {
        // Create read stream
        const stream = fs.createReadStream(path, {
            flags: 'r',
            encoding: 'utf8',
            autoClose: true
        })

        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });

        let data: T[] = [];

        // Set event
        stream
            .on('error', (err) => {
                reject(err);
            })
            .on('finish', () => {
                resolve(data);
            });

        let i = 0;
        rl.on('line', function (line: string) {
            if (!line) return;
            i++;
            const obj = new type();
            let start = 0;
            props.forEach(([key, prop]) => { // [key, prop] is [string, TxtPropsConfig]
                const config = prop as TxtPropsConfig;
                let value: string | number = line.slice(start, start + config.size).trim();
                start += config.size;
                if (config.dataType === 'number') {
                    value = Number(value);
                }
                (obj as any)[key as string] = value;
            });
            data.push(obj);
        })
        .on('close', () => {
            stream.close();
            resolve(data);
        })
        .on('error', (err) => {
            reject(err);
        });
    });
}
