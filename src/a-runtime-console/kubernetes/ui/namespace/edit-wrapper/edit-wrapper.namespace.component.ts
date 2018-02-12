import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Namespace } from '../../../model/namespace.model';
import { NamespaceStore } from '../../../store/namespace.store';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-namespace-edit-wrapper',
  templateUrl: './edit-wrapper.namespace.component.html'
})
export class NamespaceEditWrapperComponent implements OnInit {
  namespace: Observable<Namespace>;
  yamlEditor = new YamlEditor();

  constructor(private store: NamespaceStore) {
  }

  ngOnInit() {
    this.namespace = this.store.resource;
    this.namespace.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
