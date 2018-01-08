import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { MySpacesItemRoutingModule } from './my-spaces-item-routing.module';
import { MySpacesItemComponent } from './my-spaces-item.component';

@NgModule({
  imports: [
    CommonModule,
    Fabric8WitModule,
    FormsModule,
    MySpacesItemRoutingModule
  ],
  declarations: [ MySpacesItemComponent ],
  exports: [ MySpacesItemComponent ]
})
export class MySpacesItemModule {
  constructor(http: Http) {}
}
