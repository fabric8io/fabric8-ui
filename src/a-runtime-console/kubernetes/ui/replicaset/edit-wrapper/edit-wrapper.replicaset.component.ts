import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ReplicaSet} from "../../../model/replicaset.model";
import {ReplicaSetStore} from "../../../store/replicaset.store";
import {YamlEditor} from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-replicaset-edit-wrapper',
  templateUrl: './edit-wrapper.replicaset.component.html',
})
export class ReplicaSetEditWrapperComponent implements OnInit {
  replicaset: Observable<ReplicaSet>;
  yamlEditor = new YamlEditor();

  constructor(private store: ReplicaSetStore) {
  }

  ngOnInit() {
    this.replicaset = this.store.resource;
    this.replicaset.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
