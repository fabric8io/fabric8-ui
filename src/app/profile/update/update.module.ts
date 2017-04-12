import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { UpdateComponent } from './update.component';
import { UpdateRoutingModule } from './update-routing.module';

@NgModule({
  imports: [ CommonModule, FormsModule, UpdateRoutingModule, HttpModule ],
  declarations: [ UpdateComponent ],
})
export class UpdateModule {
  constructor(http: Http) {}
}
