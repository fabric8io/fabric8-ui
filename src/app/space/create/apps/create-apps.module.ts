import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { AppModule as RuntimeConsoleModule } from 'a-runtime-console/index';

@NgModule({
  imports: [CommonModule, RuntimeConsoleModule]
})
export class CreateAppsModule {
  constructor(http: Http) { }
}
