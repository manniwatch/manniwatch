const fs = require('fs');
fs.copyFileSync('./src/environments/environment.example.ts', './src/environments/environment.ts');
fs.copyFileSync('./src/environments/environment.example.ts', './src/environments/environment.prod.ts');
fs.copyFileSync('./src/environments/environment.example.ts', './src/environments/environment.dev.ts');
fs.copyFileSync('./config/config.example.ts', './config/config.ts');
