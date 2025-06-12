# @kas-tools/babel-plugin-visibility-attr

A Babel plugin that transforms `data-visible` attributes into conditional rendering expressions (`cond && <Component />`) at build time

---

The main purpose is to "make markup clean again" ✊

## ✨ Features

You write
- `<SomeComponent data-visible={condition} />`
And it's transforms into (but you don't see it)
- `condition && <SomeComponent />`

## 🔧 Install

```bash
npm install @kas-tools/babel-plugin-visibility-attr --save-dev
```

## 🧪 Usage

```json
{
  "plugins": [
    ["@kas-tools/babel-plugin-visibility-attr", {
      "attrName": "data-visible",
      "enabled": true,
    }]
  ]
}
```

## 🧾 Example

### Input in dev mode

```jsx
<SomeComponent data-visible={isVisible} />
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
