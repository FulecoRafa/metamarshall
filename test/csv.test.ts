import { toCsvFile } from "../src/FileWrite/csv";
import { animals } from "./extra";
import * as fs from "fs";

test('It should write a csv file', async () => {
    await toCsvFile(animals, 'animal.csv', false);

    expect(fs.readFileSync('animal.csv', 'utf8')).toBe(fs.readFileSync('test/files/animal.csv', 'utf8'));
})

test('It should write a csv file with header', async () => {
    await toCsvFile(animals, 'header_animal.csv');

    expect(fs.readFileSync('header_animal.csv', 'utf8')).toBe(fs.readFileSync('test/files/header_animal.csv', 'utf8'));
})
