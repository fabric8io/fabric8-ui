import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { EnvironmentModule } from '../../../../a-runtime-console/index';


@NgModule({
  imports: [CommonModule, EnvironmentModule]
})
export class CreateEnvironmentsModule {
  constructor(http: Http) { }
}
