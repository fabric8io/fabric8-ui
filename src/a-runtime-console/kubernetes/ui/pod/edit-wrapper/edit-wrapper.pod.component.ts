import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Pod} from "../../../model/pod.model";
import {PodStore} from "../../../store/pod.store";
import {YamlEditor} from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-pod-edit-wrapper',
  templateUrl: './edit-wrapper.pod.component.html',
})
export class PodEditWrapperComponent implements OnInit {
  pod: Observable<Pod>;
  yamlEditor = new YamlEditor();

  constructor(private store: PodStore) {
  }

  ngOnInit() {
    this.pod = this.store.resource;
    this.pod.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
