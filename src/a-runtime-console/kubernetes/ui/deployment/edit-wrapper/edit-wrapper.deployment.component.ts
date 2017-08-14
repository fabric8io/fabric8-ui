import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Deployment} from "../../../model/deployment.model";
import {DeploymentStore} from "../../../store/deployment.store";
import {YamlEditor} from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-deployment-edit-wrapper',
  templateUrl: './edit-wrapper.deployment.component.html',
})
export class DeploymentEditWrapperComponent implements OnInit {
  deployment: Observable<Deployment>;
  yamlEditor = new YamlEditor();

  constructor(private store: DeploymentStore) {
  }

  ngOnInit() {
    this.deployment = this.store.resource;
    this.deployment.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
