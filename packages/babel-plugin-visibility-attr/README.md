# @kas-tools/babel-plugin-ux-visibility

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
npm install babel-plugin-visibility-attr --save-dev
```

## 🧪 Usage

```json
{
  "plugins": [
    ["babel-plugin-visibility-attr", {
      "attrName": "data-visible",
      "enabled": true,
    }]
  ]
}
```

## 🧾 Example

### Input in dev mode

```jsx
<Box data-visible={isVisible} />
```

### Output in production

```jsx
isVisible && <Box />;
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
