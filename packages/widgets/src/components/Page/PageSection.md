Based on [@patternfly/react-core#PageSection](http://patternfly-react.surge.sh/patternfly-4/components/page#PageSection)

A `PageSection` is a child of `Page`.

```jsx
import { Page, PageSectionVariants } from '@osio/widgets';

<div style={{ height: 200, position: 'relative', display: 'flex', flexDirection: 'column' }}>
  <Page>
    <PageSection sticky padding="sm">
      Default variant, `sticky` section with small padding
    </PageSection>
    <PageSection variant={PageSectionVariants.light}>Light variant section</PageSection>
    <PageSection variant={PageSectionVariants.dark}>Dark variant section</PageSection>
    <PageSection variant={PageSectionVariants.darker}>Darker variant section</PageSection>
  </Page>
</div>;
```
