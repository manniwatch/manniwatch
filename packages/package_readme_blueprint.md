# {{ template:title }}
{{ template:badges }}

{{ template:description }}

## Install

Run the following command to install the package:

```
npm install {{ pkg.name }}
```

## Simple Setup

Test:
```bash
npx lerna run test --scope={{ pkg.name }}
```
Build:
```bash
npx lerna run build --scope={{ pkg.name }}
```
Lint:
```bash
npx lerna run lint --scope={{ pkg.name }}
```
