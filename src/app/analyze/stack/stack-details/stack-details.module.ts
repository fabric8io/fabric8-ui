import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import {DataTableModule} from "angular2-datatable";

import { StackDetailsComponent }     from './stack-details.component';
import { ModalModule } from 'ng2-modal';

import {StackRecoModule} from '../stack-recommendation/module';
import {ContainerTogglerModule} from '../container-toggler/module';

@NgModule({
  imports:      [StackRecoModule, ContainerTogglerModule, CommonModule, HttpModule,DataTableModule, ModalModule ],
  declarations: [ StackDetailsComponent ],
  exports: [ StackDetailsComponent ]
})
export class StackDetailsModule {
  constructor(http: Http) {}
}