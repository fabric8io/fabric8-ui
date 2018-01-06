import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PodService } from '../../../service/pod.service';
import { YamlEditor } from '../../../view/yaml.editor';
import { Pod } from '../../../model/pod.model';

@Component({
  selector: 'fabric8-pod-edit-toolbar',
  templateUrl: './edit-toolbar.pod.component.html',
  styleUrls: ['./edit-toolbar.pod.component.less']
})
export class PodEditToolbarComponent {

  @Input() pod: Pod;

  @Input() yamlEditor: YamlEditor;

  constructor(private podService: PodService, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.podService.updateResource(this.pod, resource).subscribe(
      () => this.router.navigate(['pods'])
    );
  }
}
