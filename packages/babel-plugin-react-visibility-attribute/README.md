# @kas-tools/babel-plugin-react-visibility-attribute

A Babel plugin that transforms `data-if` attributes into conditional rendering expressions (`cond && <Component />`) at build time

---

![JSX-first](https://img.shields.io/badge/JSX--first-%23e10098.svg)
![Zero-runtime](https://img.shields.io/badge/zero--runtime-%23green.svg)
![UX declarative](https://img.shields.io/badge/UX--attribute--driven-blueviolet)
![npm version](https://img.shields.io/npm/v/@kas-tools/babel-plugin-react-visibility-attribute)
![npm downloads](https://img.shields.io/npm/dm/@kas-tools/babel-plugin-react-visibility-attribute)
![Build](https://github.com/kas-elvirov/kas-tools/actions/workflows/ci.yml/badge.svg)

---

The main purpose is to "make markup clean again" ✊

## ✨ Features

You write

- `<SomeComponent data-if={condition} />`
  And it's transforms into (but you don't see it)
- `condition && <SomeComponent />`

## 🔧 Install

```bash
npm install @kas-tools/babel-plugin-react-visibility-attribute --save-dev
```

## 🧪 Usage

**babel.config.js**

```json
{
  "plugins": [
    [
      "@kas-tools/babel-plugin-react-visibility-attribute",
      {
        "attrName": "data-if",
        "enabled": true
      }
    ]
  ]
}
```

**vite.config.js**

```js
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@kas-tools/babel-plugin-react-visibility-attribute',
            {
              attrName: 'data-if',
              enabled: true,
            },
          ],
        ],
      },
    }),
  ],
});
```

## 🧾 Example

### Input in dev mode

```jsx
<SomeComponent data-if={isVisible} />
```

### In the browser

```jsx
// If isVisible === true

<SomeComponent />
```

```jsx
// If isVisible === false

null; // nothing
```

### Output in production build

```jsx
isVisible && <SomeComponent />;
```

## 🧪 Test

```bash
npm i -ddd
npm test
```

## 🖤 Inspiration

This package inspired by post [How to add custom attribute for conditional render?](https://stackoverflow.com/questions/79662332/how-to-add-custom-attribute-for-conditional-render) from [Mahdi](https://stackoverflow.com/users/2535843/mahdi) ([github](https://github.com/mahdix), [official website](https://mahdix.com/))

---

MIT License © 2025
