import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Http} from "@angular/http";
import {EnvironmentModule} from "fabric8-runtime-console";


@NgModule({
  imports: [CommonModule, EnvironmentModule],
})
export class CreateEnvironmentsModule {
  constructor(http: Http) { }
}
