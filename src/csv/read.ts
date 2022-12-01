import { CsvPropsConfig, IsCsvDecorated } from "./decorator";
import { CsvDecoratorNotImplementedError, IncorrectLineError } from "../errors";
import * as fs from "fs";
import * as readline from "readline";

export async function fromCsvFile<T>(path: string, type: (new () => T)): Promise<T[]> {
    const dummy = new type();

    //check if T is decorated with @Csv
    if (!('_csvProps' in (dummy as Object)) || !('_csvDelimiter' in (dummy as Object))) {
        throw new CsvDecoratorNotImplementedError(type);
    }

    //convert T to implementation of IsCsvDecorated
    const cls = dummy as any as IsCsvDecorated;

    // Props is [key, CsvPropsConfig][]. Type not specified because it's not supported by Typescript.
    let props = Object.keys(cls._csvProps)
        .map(key => [key, cls._csvProps[key]]);
    const header = props.map(([_key, prop]) => (prop as CsvPropsConfig).name).join(cls._csvDelimiter);

    return new Promise((resolve, reject) => {
        // Create read stream
        const stream = fs.createReadStream(path, {
            flags: 'r',
            encoding: 'utf8',
            autoClose: true
        });

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

        let headerChecked = false;
        let i = 0;
        rl.on('line', function (line: string) {
            i++;
            if (!headerChecked) {
                if (line === header) {
                    const headerProps = line.split(cls._csvDelimiter);
                    props.sort((a, b) =>
                        headerProps.indexOf((a[1] as CsvPropsConfig).name) - headerProps.indexOf((b[1] as CsvPropsConfig).name)
                    );
                    headerChecked = true;
                    return;
                }
                headerChecked = true;
            }

            let obj = new type();
            let values = line
                .split(cls._csvDelimiter)
                // Reformat each field
                // remove quotes if present
                .map(value => value.replace(/^"(.*)"$/, '$1'))
                // remove spaces if present
                .map(value => value.trim());

            if (values.length !== props.length) {
                throw new IncorrectLineError(i, line);
            }

            for (let j = 0; j < props.length; j++) {
                const [key, _prop] = props[j]; // Always [string, CsvPropsConfig]
                (obj as any)[(key as string)] = values[j];
            }

            data.push(obj);
        })
        .on('close', () => {
            stream.close();
            resolve(data);
        })
        .on('error', (err) => {
            reject(err);
        })

        // rl.emit('line')

    })
}
