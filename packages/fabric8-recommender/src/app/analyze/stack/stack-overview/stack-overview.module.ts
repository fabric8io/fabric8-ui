import { StackDetailsModule } from './../stack-details/stack-details.module';
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { StackOverviewComponent } from './stack-overview.component';

@NgModule({
  imports: [CommonModule, HttpModule, StackDetailsModule],
  declarations: [StackOverviewComponent, CollapseDirective],
})
export class StackOverviewModule {
  constructor(http: Http) { }
}
