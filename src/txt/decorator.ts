/**
 * Configuration for properties in classes
 * @param size Size of the property in the TXT file. Should be greater than 0.
 * @param dataType Data type of the property in the TXT file. Can be 'number' or 'string'
 * @param padding Padding of the property in the TXT file. Can be 'left' or 'right'
 * @param emptyChar Character used to fill the empty space in the TXT file. Default is ' '.
 */
export interface TxtPropsConfig {
    size: number;
    dataType: 'number' | 'string';
    padding?: 'left' | 'right';
    emptyChar?: string;
}

/**
 * Interface for classes decorated with @Txt
 */
export interface IsTxtDecorated {
    _txtProps: { [key: string]: TxtPropsConfig };
}

/**
 * Decorator for properties classes that will be converted to TXT files.
 * @param options Options for the property.
 */
export function TxtProp(options: TxtPropsConfig) {
    let config: TxtPropsConfig = {
        padding: 'left',
        emptyChar: ' ',
        ...options
    };
    return function (target: any, propertyKey: string) {
        // Create _csvProps if it doesn't exist
        createTxtProps(target);
        target._txtProps[propertyKey] = config;
    }
}

function createTxtProps(target: any) {
    const p = '_txtProps';
    if (!(p in target)) {
        Object.defineProperty(target, p, {
            value: {},
            writable: true,
            enumerable: true,
        });
    }
}
