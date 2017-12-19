import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { MySpacesItemComponent } from './my-spaces-item.component';
import { MySpacesItemRoutingModule } from './my-spaces-item-routing.module';

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
