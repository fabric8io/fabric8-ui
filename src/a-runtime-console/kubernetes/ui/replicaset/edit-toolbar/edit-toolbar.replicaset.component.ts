import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ReplicaSet } from '../../../model/replicaset.model';
import { ReplicaSetService } from '../../../service/replicaset.service';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-replicaset-edit-toolbar',
  templateUrl: './edit-toolbar.replicaset.component.html',
  styleUrls: ['./edit-toolbar.replicaset.component.less']
})
export class ReplicaSetEditToolbarComponent {

  @Input() replicaset: ReplicaSet;

  @Input() yamlEditor: YamlEditor;

  constructor(private replicasetService: ReplicaSetService, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.replicasetService.updateResource(this.replicaset, resource).subscribe(
      () => this.router.navigate(['replicasets'])
    );
  }
}
