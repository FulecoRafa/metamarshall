import { Csv, CsvProperty, TxtProp } from "../src";

@Csv(';')
export class Animal {
    @CsvProperty({name: 'Nome', padding: 'right', fixedWidth: 50})
    @TxtProp({size: 50, padding: 'right', dataType: 'string'})
    public name: string;

    @CsvProperty({name: 'Animal'})
    @TxtProp({size: 10, dataType: 'string', padding: 'right'})
    public type: string;

    constructor(name: string = '', type: string = '') {
        this.name = name;
        this.type = type;
    }
}

export let animals = [
    new Animal('Caramelo', 'Cachorro'),
    new Animal('Pé de Pano', 'Gato'),
    new Animal('Miauzinho', 'Gato'),
    new Animal('Dengosa', 'Vaca'),
]
