import { Component, ViewEncapsulation } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'demo-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}

  ngOnInit() {}
}
