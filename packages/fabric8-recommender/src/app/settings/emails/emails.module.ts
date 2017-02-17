import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule }      from '@angular/forms';

import { EmailsComponent }     from './emails.component';
import { EmailsRoutingModule } from './emails-routing.module';

@NgModule({
  imports:      [ CommonModule, EmailsRoutingModule, HttpModule, FormsModule ],
  declarations: [ EmailsComponent ],
})
export class EmailsModule {
  constructor(http: Http) {}
}
