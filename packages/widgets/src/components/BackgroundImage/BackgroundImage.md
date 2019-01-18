Based on [@patternfly/react-core#BackgroundImage](http://patternfly-react.surge.sh/patternfly-4/components/backgroundimage)

When using the `backgroundFilterImage`, ensure to reference the `image_overlay` as follows: `${backgroundFilterImage}#image_overlay`

```js static
const BackgroundImageSrc = {
  lg: 'lg',
  sm: 'sm',
  sm2x: 'sm2x',
  xs: 'xs',
  xs2x: 'xs2x',
  filter: 'filter',
};
```

```jsx
import { BackgroundImageSrc, backgroundFilterImage } from '@osio/widgets';
const images = {
  [BackgroundImageSrc.lg]: './images/pfbg_1200.jpg',
  [BackgroundImageSrc.sm]: './images/pfbg_768.jpg',
  [BackgroundImageSrc.sm2x]: './images/pfbg_768@2x.jpg',
  [BackgroundImageSrc.xs]: './images/pfbg_576.jpg',
  [BackgroundImageSrc.xs2x]: './images/pfbg_576@2x.jpg',
  [BackgroundImageSrc.filter]: `${backgroundFilterImage}#image_overlay`,
};

<div style={{ height: 200, transform: 'translate(0, 0)' }}>
  <BackgroundImage src={images} />
</div>;
```
