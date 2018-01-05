import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Pod } from "../../../model/pod.model";
import { PodStore } from "../../../store/pod.store";
import { AbstractViewWrapperComponent } from "../../../support/abstract-viewwrapper-component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'fabric8-pod-view-wrapper',
  templateUrl: './view-wrapper.pod.component.html'
})
export class PodViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  pod: Observable<Pod>;

  constructor(private store: PodStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pod = this.store.resource;
  }
}
