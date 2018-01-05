import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

@NgModule({
  imports: [ CommonModule, FormsModule, GettingStartedRoutingModule ],
  declarations: [ GettingStartedComponent ]
})
export class GettingStartedModule {
  constructor() {}
}
