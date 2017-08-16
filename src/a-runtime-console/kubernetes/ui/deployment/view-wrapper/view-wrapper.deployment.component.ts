import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Deployment} from "../../../model/deployment.model";
import {CompositeDeploymentStore} from "../../../store/compositedeployment.store";
import {ActivatedRoute} from "@angular/router";
import {AbstractViewWrapperComponent} from "../../../support/abstract-viewwrapper-component";

@Component({
  selector: 'fabric8-deployment-view-wrapper',
  templateUrl: './view-wrapper.deployment.component.html',
})
export class DeploymentViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  deployment: Observable<Deployment>;

  constructor(private store: CompositeDeploymentStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.deployment = this.store.resource;
  }
}
