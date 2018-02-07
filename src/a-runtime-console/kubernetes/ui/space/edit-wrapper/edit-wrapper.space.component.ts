import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Space } from '../../../model/space.model';
import { SpaceStore } from '../../../store/space.store';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-space-edit-wrapper',
  templateUrl: './edit-wrapper.space.component.html'
})
export class SpaceEditWrapperComponent implements OnInit {
  space: Observable<Space>;
  yamlEditor = new YamlEditor();

  constructor(private store: SpaceStore) {
  }

  ngOnInit() {
    this.space = this.store.resource;
    this.space.subscribe((d) => {
      if (d) {
        this.yamlEditor.loadResource(d.namespace);
      }
    });
  }
}
