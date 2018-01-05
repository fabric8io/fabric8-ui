import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BuildConfig } from "../../../model/buildconfig.model";
import { BuildConfigStore } from "../../../store/buildconfig.store";
import { AbstractViewWrapperComponent } from "../../../support/abstract-viewwrapper-component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'fabric8-pipeline-view-wrapper',
  templateUrl: './view-wrapper.pipeline.component.html',
})
export class PipelineViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  pipeline: Observable<BuildConfig>;

  constructor(private store: BuildConfigStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pipeline = this.store.resource;
  }
}
