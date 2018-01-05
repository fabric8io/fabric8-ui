import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Service } from "../../../model/service.model";
import { ServiceStore } from "../../../store/service.store";
import { YamlEditor } from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-service-edit-wrapper',
  templateUrl: './edit-wrapper.service.component.html',
})
export class ServiceEditWrapperComponent implements OnInit {
  service: Observable<Service>;
  yamlEditor = new YamlEditor();

  constructor(private store: ServiceStore) {
  }

  ngOnInit() {
    this.service = this.store.resource;
    this.service.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
