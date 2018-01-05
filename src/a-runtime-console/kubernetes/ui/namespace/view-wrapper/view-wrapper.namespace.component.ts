import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Namespace } from "../../../model/namespace.model";
import { NamespaceStore } from "../../../store/namespace.store";
import { AbstractViewWrapperComponent } from "../../../support/abstract-viewwrapper-component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'fabric8-namespace-view-wrapper',
  templateUrl: './view-wrapper.namespace.component.html'
})
export class NamespaceViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  namespace: Observable<Namespace>;

  constructor(private store: NamespaceStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.namespace = this.store.resource;
  }
}
