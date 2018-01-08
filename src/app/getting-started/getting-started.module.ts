import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GettingStartedRoutingModule } from './getting-started-routing.module';
import { GettingStartedComponent } from './getting-started.component';

@NgModule({
  imports: [ CommonModule, FormsModule, GettingStartedRoutingModule ],
  declarations: [ GettingStartedComponent ]
})
export class GettingStartedModule {
  constructor() {}
}
