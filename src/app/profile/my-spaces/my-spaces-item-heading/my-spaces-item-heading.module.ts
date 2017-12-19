import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { MySpacesItemHeadingComponent } from './my-spaces-item-heading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ MySpacesItemHeadingComponent ],
  exports: [ MySpacesItemHeadingComponent ],
  providers: [TooltipConfig]
})
export class MySpacesItemHeadingModule {
  constructor(http: Http) {}
}
