# Dear Mahdi

I'v very sorry, that community decided to close [your question](https://stackoverflow.com/questions/79662332/how-to-add-custom-attribute-for-conditional-render). Personally i struggled for about 5 years about conditions in markup but i could't think a way to solve this until your post. And i'm very greatful for that

Here below is possible solution for you. Let me know if it works for you or you have any idead how to make it better

---

# My options before

First of all it's one of my points on code-review. So for me and developers it's a total nightmare

## Moving conditions into separate funtions

It's quite ugly

```jsx
const SomeComponent: FC<ISomeComponentProps> = (props) => {
  const renderInnerComponent = () => {
    if (props.condition) {
      return <InnerComponent />;
    }

    return null;
  }

  return renderInnerComponent();
}

```

and it's especially for big components

```jsx
const SomeComponent: FC<ISomeComponentProps> = (props) => {
  const renderInnerComponent1 = () => {
    if (props.condition1) {
      return <InnerComponent1 />;
    }

    return null;
  };

  const renderInnerComponent2 = () => {
    if (props.condition2) {
      return <InnerComponent2 />;
    }

    return null;
  };

  const renderInnerComponent3 = () => {
    if (props.condition3) {
      return <InnerComponent3 />;
    }

    return null;
  };

  return (
    <>
      {renderInnerComponent1()}

      {renderInnerComponent2()}

      {renderInnerComponent3()}
    </>
  );
}

```

## Using HOCs

Check out [live preview](https://codesandbox.io/p/sandbox/734ytn?file=%2Fsrc%2FApp.tsx%3A13%2C1) in order to see how ugly it is
- it's hard to read (first time and you have adapt)
- you have to know about this method in order to know what you have to do
- logic of one component is separated into next places
  - `withConditionalRendering` HOC
  - `HOC` calling -> `const RewiredInnerComponent = withConditionalRendering(InnerComponent, isVisible);`
  - resulted markap after return `<RewiredInnerComponent />`

```jsx

function withConditionalRendering<P extends object>(
  Component: FC<P>,
  condition: boolean
) {
  return (props: P) => {
    if (condition) {
      return <Component {...props} />;
    }

    return null;
  };
}

const InnerComponent: FC = () => {
  return <div>InnerComponent</div>;
};

export default function App() {
  const [isVisible, seVisibility] = useState(true);

  const RewiredInnerComponent = withConditionalRendering(
    InnerComponent,
    isVisible
  );

  const toggleVisibility = () => {
    seVisibility(!isVisible);
  };

  return (
    <div className="App">
      <button onClick={toggleVisibility}>Toggle visibility</button>

      <RewiredInnerComponent />
    </div>
  );
}

```

so after trying these "optimizations" i stucked... until a few days ago

# My solution now

Is to move all conditions into background (at build time) by using our amazing [Babel](https://babeljs.io)

So now it require a few next steps

1. Install plugin

> npm install @kas-tools/babel-plugin-visibility-attr --save-dev

2. Configure babel.config.js

```json
{
  "plugins": [
    ["@kas-tools/babel-plugin-visibility-attr", {
      "attrName": "data-visible",
      "enabled": true,
    }]
  ]
}

3. Write your code

```jsx
  <SomeComponent data-visible={isVisible} />
```

4. Check output for

magic ✨
