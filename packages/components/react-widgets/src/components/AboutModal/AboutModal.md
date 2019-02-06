Based on [@patternfly/react-core#AboutModal](http://patternfly-react.surge.sh/patternfly-4/components/aboutmodal)

```jsx
import brandImageSrc from './sample/brand.svg';
import heroImageSrc from './sample/hero.jpg';
import logoImageSrc from './sample/logo.svg';

initialState = {
  open: false,
};
<>
  <button onClick={() => setState({ open: true })}>Open About Modal</button>
  <AboutModal
    isOpen={state.open}
    onClose={() => setState({ open: false })}
    productName="Product Name"
    trademark="This is the trademark text"
    brandImageSrc={brandImageSrc}
    brandImageAlt="Brand alt"
    heroImageSrc={heroImageSrc}
    heroImageAlt="Hero alt"
    logoImageSrc={logoImageSrc}
    logoImageAlt="Logo alt"
  >
    This is the modal content.
  </AboutModal>
</>;
```
