import { FormsModule } from '@angular/forms';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ProfileComponent }     from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports:      [ CommonModule, ProfileRoutingModule, HttpModule, FormsModule ],
  declarations: [ ProfileComponent ],
})
export class ProfileModule {
  constructor(http: Http) {}
}
