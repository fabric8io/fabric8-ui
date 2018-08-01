import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { MySpacesItemRoutingModule } from './my-spaces-item-routing.module';
import { MySpacesItemComponent } from './my-spaces-item.component';

@NgModule({
  imports: [
    CommonModule,
    Fabric8WitModule,
    FormsModule,
    HttpClientModule,
    MySpacesItemRoutingModule
  ],
  declarations: [ MySpacesItemComponent ],
  exports: [ MySpacesItemComponent ]
})
export class MySpacesItemModule {}
