import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Deployment } from '../../../model/deployment.model';
import { DeploymentService } from '../../../service/deployment.service';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-deployment-edit-toolbar',
  templateUrl: './edit-toolbar.deployment.component.html',
  styleUrls: ['./edit-toolbar.deployment.component.less']
})
export class DeploymentEditToolbarComponent {

  @Input() deployment: Deployment;

  @Input() yamlEditor: YamlEditor;

  constructor(private deploymentService: DeploymentService, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.deploymentService.updateResource(this.deployment, resource).subscribe(
      () => this.router.navigate(['deployments'])
    );
  }
}
