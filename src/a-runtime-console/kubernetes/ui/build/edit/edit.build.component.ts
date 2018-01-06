import { Input, Component } from '@angular/core';
import { Build } from '../../../model/build.model';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-build-edit',
  templateUrl: './edit.build.component.html'
})
export class BuildEditComponent {

  @Input() build: Build;

  @Input() yamlEditor: YamlEditor;

}
