import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RenderStackDetailsComponent } from './render-stack-details.component';
import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';



import { CommonModule }     from '@angular/common';

@NgModule({
  declarations: [ RenderStackDetailsComponent ]
})
export class StackModule {
  constructor() {}
}
