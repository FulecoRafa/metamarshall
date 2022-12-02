export class IncorrectLineError extends Error {
    constructor(public line: number, public content: string) {
        const message = `Invalid number of fields in line ${line}: ${content}`
        super(message);
        this.name = 'IncorrectLineError';
    }
}

export class CsvDecoratorNotImplementedError<T> extends Error {
    constructor(type: (new () => T)) {
        const message = `Class ${typeof type} must be decorated with @Csv`;
        super(message);
        this.name = 'CsvDecoratorNotImplementedError';
    }
}

export class TxtDecoratorNotImplementedError<T> extends Error {
    constructor(type: (new () => T)) {
        const message = `Class ${typeof type} must be decorated with @Txt`;
        super(message);
        this.name = 'TxtDecoratorNotImplementedError';
    }
}
