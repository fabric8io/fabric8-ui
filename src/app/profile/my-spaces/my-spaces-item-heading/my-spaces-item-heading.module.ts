import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class MySpacesItemHeadingModule {}
