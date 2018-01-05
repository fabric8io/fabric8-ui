import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Build } from "../../../model/build.model";
import { BuildStore } from "../../../store/build.store";
import { YamlEditor } from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-build-edit-wrapper',
  templateUrl: './edit-wrapper.build.component.html'
})
export class BuildEditWrapperComponent implements OnInit {
  build: Observable<Build>;
  yamlEditor = new YamlEditor();

  constructor(private store: BuildStore) {
  }

  ngOnInit() {
    this.build = this.store.resource;
    this.build.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
