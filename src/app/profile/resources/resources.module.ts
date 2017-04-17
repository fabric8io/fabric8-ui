import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { ResourcesComponent }     from './resources.component';
import { ResourcesRoutingModule } from './resources-routing.module';

@NgModule({
  imports:      [ CommonModule, ResourcesRoutingModule ],
  declarations: [ ResourcesComponent ],
})
export class ResourcesModule {
  constructor(http: Http) {}
}
