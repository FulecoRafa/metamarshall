import { Csv, CsvProperty } from "../src";

@Csv(';')
export class Animal {
    @CsvProperty({name: 'Nome', padding: 'right', fixedWidth: 50})
    public name: string;

    @CsvProperty({name: 'Animal'})
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
