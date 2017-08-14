import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ConfigMap} from "../../../model/configmap.model";
import {ConfigMapStore} from "../../../store/configmap.store";
import {AbstractViewWrapperComponent} from "../../../support/abstract-viewwrapper-component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'fabric8-configmap-view-wrapper',
  templateUrl: './view-wrapper.configmap.component.html',
})
export class ConfigMapViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  configmap: Observable<ConfigMap>;

  constructor(private store: ConfigMapStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.configmap = this.store.resource;
  }
}
