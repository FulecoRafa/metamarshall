/**
 * Configuration for properties in classes
 * @param name Name of the property in the CSV file
 * @param fixedWidth Fixed width of the property in the CSV file. 0 means no limit
 * @param dataType Data type of the property in the CSV file. Can be 'number' or 'string'
 * @param padding Padding of the property in the CSV file. Can be 'left' or 'right'
 * @param quoted If the property should be quoted in the CSV file
 */
export interface CsvPropsConfig {
    name: string;
    quoted: boolean;
    // 0 means no limit
    fixedWidth: number;
    dataType: 'number' | 'string';
    padding: 'left' | 'right';
}

/**
 * Interface for classes decorated with @Csv
 * _csvProps is a dictionary of CsvPropsConfig showing the fields and their properties.
 * _csvDelimiter is the delimiter used in the CSV file.
 */
export interface IsCsvDecorated {
    _csvProps: { [key: string]: CsvPropsConfig };
    _csvDelimiter: string;
}

/**
 * Decorator for classes that will be converted to CSV files.
 * @param delimiter Delimiter used in the CSV file. Default is ','.
 */
export function Csv<T extends { new (...args: any[]): {} }>(delimiter: string = ','){
    if (delimiter.length !== 1) {
        throw new Error('Delimiter must be a single character');
    }
    return function<T extends { new (...args: any[]): {} }> (constructor: T) {
        return class extends constructor {
            public _csvDelimiter: string;
            constructor(...args: any[]) {
                super(...args);
                this._csvDelimiter = delimiter;
            }
        }
    }
}

/**
 * Decorator for properties of classes decorated with @Csv.
 * @param options Options for the property.
 */
export function CsvProperty(options: Partial<CsvPropsConfig>) {
    let config: CsvPropsConfig = {
        name: '',
        quoted: false,
        fixedWidth: 0,
        dataType: 'string',
        padding: 'left',
        ...options
    };
    return function (target: any, propertyKey: string) {
        // Create _csvProps if it doesn't exist
        createCsvProps(target);
        target._csvProps[propertyKey] = config;
    }
}

function createCsvProps(target: any) {
    if (!('_csvProps' in target)) {
        Object.defineProperty(target, '_csvProps', {
            value: {},
            writable: true,
            enumerable: true,
        });
    }
}
