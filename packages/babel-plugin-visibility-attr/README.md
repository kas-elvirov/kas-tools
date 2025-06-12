# babel-plugin-visibility-attr

A Babel plugin to declaratively control React component behavior with data-visible attribute. The main purpose - to make markup clean ✨

## ✨ Features

You write
- `<Component data-visible={condition} />`
And it's transforms into (but you don't see it)
- `condition && <Component />`

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
