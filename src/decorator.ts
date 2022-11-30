export interface CsvPropsConfig {
    name: string;
    quoted: boolean;
    // 0 means no limit
    fixedWidth: number;
    dataType: 'number' | 'string';
    padding: 'left' | 'right';
}

export interface IsCsvDecorated {
    _csvProps: { [key: string]: CsvPropsConfig };
    _csvDelimiter: string;
}

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

export function CsvProperty(original: Partial<CsvPropsConfig>) {
    let config: CsvPropsConfig = {
        name: '',
        quoted: false,
        fixedWidth: 0,
        dataType: 'string',
        padding: 'left',
        ...original
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
