import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

@NgModule({
  imports: [CommonModule],
})
export class PlanBoardModule {
  constructor(http: Http) {}
}
