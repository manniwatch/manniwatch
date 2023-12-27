import fs from 'node:fs';
fs.mkdirSync('./dist/cjs', { recursive: true });
fs.mkdirSync('./dist/esm', { recursive: true });
