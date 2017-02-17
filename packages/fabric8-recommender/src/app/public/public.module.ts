// Temporary module which mocks out our public web experience
// Long run, we probably want the public experience to be built using a CMS
// Either dyamic like Drupal or static like scalate/awestruct/jekyll

import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { FlashMessagesModule } from 'angular2-flash-messages';

import { PublicComponent }   from './public.component';
import { PublicRoutingModule }   from './public-routing.module';

@NgModule({
  imports:      [ CommonModule, PublicRoutingModule, HttpModule, FlashMessagesModule ],
  declarations: [ PublicComponent ]
})
export class PublicModule {
  constructor(http: Http) {}
}
