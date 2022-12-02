import { toCsvFile } from "../src";
import { animals, Animal } from "./extra";
import * as fs from "fs";
import { fromCsvFile } from "../src";

test('It should write a csv file', async () => {
    await toCsvFile('animal.csv', animals, false);

    expect(fs.readFileSync('animal.csv', 'utf8')).toBe(fs.readFileSync('test/files/animal.csv', 'utf8'));
});

test('It should write a csv file with header', async () => {
    await toCsvFile('header_animal.csv', animals);

    expect(fs.readFileSync('header_animal.csv', 'utf8')).toBe(fs.readFileSync('test/files/header_animal.csv', 'utf8'));
});

test('It should read a csv file', async () => {
    const test_animals = await fromCsvFile('test/files/animal.csv', Animal);

    expect(test_animals).toMatchObject(animals);
});

test('It should read a csv file with header', async () => {
    const test_animals = await fromCsvFile('test/files/header_animal.csv', Animal);

    expect(test_animals).toMatchObject(animals);
});
