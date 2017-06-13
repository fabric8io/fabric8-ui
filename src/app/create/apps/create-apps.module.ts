import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Http} from "@angular/http";
import {AppModule} from "fabric8-runtime-console";


@NgModule({
  imports: [CommonModule, AppModule],
})
export class CreateAppsModule {
  constructor(http: Http) { }
}
