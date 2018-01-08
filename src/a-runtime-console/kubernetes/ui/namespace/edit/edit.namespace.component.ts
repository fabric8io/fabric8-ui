import { Component, Input } from '@angular/core';
import { Namespace } from '../../../model/namespace.model';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-namespace-edit',
  templateUrl: './edit.namespace.component.html'
})
export class NamespaceEditComponent {

  @Input() namespace: Namespace;

  @Input() yamlEditor: YamlEditor;

}
