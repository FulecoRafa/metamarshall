import { fromTxtFile, toTxtFile } from "../src";
import { Animal, animals } from "./extra";
import * as fs from "fs";

test('It should write a TXT file', async () => {
    await toTxtFile('animal.txt', animals);

    expect(fs.readFileSync('animal.txt', 'utf8')).toBe(fs.readFileSync('test/files/animal.txt', 'utf8'));
})

test('It should read a TXT file', async () => {
    const test_animals = await fromTxtFile('test/files/animal.txt', Animal);

    expect(test_animals).toMatchObject(animals);
})
