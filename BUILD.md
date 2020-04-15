# Сборка КриптоАРМ ГОСТ

Описан процесс сборки portable версии

## Необходимое окружение

- Node.js v12.n LTS

## VS code extensions

Расширения нужны для единообразного форматирования кода и статического анализа кода

- Name: Editor Config for VS Code (Id: chrisdias.vscodeeditorconfig)
- Name: ESLint (Id: dbaeumer.vscode-eslint)
- Name: TSLint (Id: ms-vscode.vscode-typescript-tslint-plugin)

## Используемые подпроекты

- trusted-crypto
- trusted-curl

## Сборка

```bash
npm install -g typescript
npm install
cd app
npm install
cd ..
npm run package
```

На windows последний шаг поменять на: npm run package-win
Собранные модули trusted-crypto и trusted-curl надо скопировать в

dist/<system>-unpacked/resources/app/node_modules

## Запуск для разработки

```bash
npm install -g typescript
npm install
cd app
npm install
cd ..
npm run dev
```

Собранные модули trusted-crypto и trusted-curl надо скопировать в

./app/node_modules
