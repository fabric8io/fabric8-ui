// Temporary module which mocks out our control web experience
// Long run, we probably want the control experience to be built using a CMS
// Either dyamic like Drupal or static like scalate/awestruct/jekyll

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ControlComponent } from './control.component';
import { ControlRoutingModule } from './control-routing.module';
import { FlashMessagesModule } from 'angular2-flash-messages';


@NgModule({
  imports: [CommonModule, ControlRoutingModule, HttpModule, FormsModule, FlashMessagesModule],
  declarations: [ControlComponent]
})
export class ControlModule {
  constructor(http: Http) { }
}
