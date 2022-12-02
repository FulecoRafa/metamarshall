export interface TxtPropsConfig {
    size: number;
    dataType: 'number' | 'string';
    padding?: 'left' | 'right';
    emptyChar?: string;
}

export interface IsTxtDecorated {
    _txtProps: { [key: string]: TxtPropsConfig };
}

export function TxtProp(original: TxtPropsConfig) {
    let config: TxtPropsConfig = {
        padding: 'left',
        emptyChar: ' ',
        ...original
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
