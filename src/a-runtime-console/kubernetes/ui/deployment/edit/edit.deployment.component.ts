import { Component, Input } from '@angular/core';
import { Deployment } from '../../../model/deployment.model';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-deployment-edit',
  templateUrl: './edit.deployment.component.html'
})
export class DeploymentEditComponent {

  @Input() deployment: Deployment;

  @Input() yamlEditor: YamlEditor;

}
