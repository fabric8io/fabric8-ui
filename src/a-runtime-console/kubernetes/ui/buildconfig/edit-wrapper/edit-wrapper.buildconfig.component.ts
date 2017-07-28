import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {BuildConfig} from "../../../model/buildconfig.model";
import {BuildConfigStore} from "../../../store/buildconfig.store";
import {YamlEditor} from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-buildconfig-edit-wrapper',
  templateUrl: './edit-wrapper.buildconfig.component.html',
  styleUrls: ['./edit-wrapper.buildconfig.component.scss'],
})
export class BuildConfigEditWrapperComponent implements OnInit {
  buildconfig: Observable<BuildConfig>;
  yamlEditor = new YamlEditor();

  constructor(private store: BuildConfigStore) {
  }

  ngOnInit() {
    this.buildconfig = this.store.resource;
    this.buildconfig.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
