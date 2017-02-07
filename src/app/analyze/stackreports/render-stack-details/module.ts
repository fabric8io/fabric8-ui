import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {DataTableModule} from "angular2-datatable";
//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RenderStackDetailsComponent } from './render-stack-details.component';
import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';


import {StackRecoModule} from '../stack-recommendation/module';
import {ContainerTogglerModule} from '../container-toggler/module';



import { CommonModule }     from '@angular/common';

@NgModule({
  imports: [StackRecoModule, ContainerTogglerModule, CommonModule, DataTableModule],
  declarations: [ RenderStackDetailsComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StackModule {
  constructor() {}
}
