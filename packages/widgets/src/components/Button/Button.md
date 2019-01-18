Based on [@patternfly/react-core#Button](http://patternfly-react.surge.sh/patternfly-4/components/button)

```js
initialState = { count: 0 };
<Button onClick={() => setState({ count: state.count + 1 })}>Click Me {state.count}</Button>;
```

Variants:

```jsx
<div className="styleguide-separated">
  <Button>Default</Button>
  <Button isPrimary>Primary</Button>
  <Button isSecondary>Secondary</Button>
  <Button isTertiary>Tertiary</Button>
  <Button isDanger>Danger</Button>
  <Button isPlain>Plain</Button>
  <Button isLink>Link</Button>
</div>
```

Block:

```jsx
<Button isBlock>Full Width Button</Button>
```
