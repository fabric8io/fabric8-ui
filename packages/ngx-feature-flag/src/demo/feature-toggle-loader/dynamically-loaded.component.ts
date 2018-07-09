import {
  Component
} from '@angular/core';

@Component({
  selector: 'f8-dynamically-loaded',
  template: `<div style="background-color: green; opacity: .5" user-level>
      <h1>
          😀 🤪
      </h1>
      <h2>Yay loaded just for you</h2>
  </div>`
})
export class DynamicallyLoadedComponent {
  constructor() {}
}
