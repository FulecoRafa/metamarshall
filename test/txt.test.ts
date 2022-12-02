import { toTxtFile } from "../src/txt/write";
import { animals } from "./extra";
import * as fs from "fs";

test('It should write a TXT file', async () => {
    await toTxtFile('animal.txt', animals);

    expect(fs.readFileSync('animal.txt', 'utf8')).toBe(fs.readFileSync('test/files/animal.txt', 'utf8'));
})
