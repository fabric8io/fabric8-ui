Standard dropdown:

```jsx
import { DropdownItem } from '@talamer/react-widgets';
<Dropdown label="Normal">
  <DropdownItem>Sample item</DropdownItem>
</Dropdown>;
```

Icon dropdown:

```jsx
import { HelpIcon } from '@patternfly/react-icons';
import { DropdownItem } from '@talamer/react-widgets';
<Dropdown isPlain label={<HelpIcon />}>
  <DropdownItem>Sample item</DropdownItem>
</Dropdown>;
```

Various [DropdownItems](#DropdownItem):

```jsx
import { DropdownItem, DropdownSeparator } from '@talamer/react-widgets';
<Dropdown label="Click Me">
  <DropdownItem onClick={() => alert('clicked')}>Fire alert</DropdownItem>
  <DropdownItem isDisabled>Disabled</DropdownItem>
  <DropdownSeparator />
  <DropdownItem target="_blank" href="https://www.redhat.com">
    Red Hat
  </DropdownItem>
</Dropdown>;
```
