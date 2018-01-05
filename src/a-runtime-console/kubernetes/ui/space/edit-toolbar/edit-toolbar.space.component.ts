import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { YamlEditor } from "../../../view/yaml.editor";
import { Space } from "../../../model/space.model";
import { SpaceStore } from "../../../store/space.store";

@Component({
  selector: 'fabric8-space-edit-toolbar',
  templateUrl: './edit-toolbar.space.component.html',
  styleUrls: ['./edit-toolbar.space.component.less'],
})
export class SpaceEditToolbarComponent {

  @Input() space: Space;

  @Input() yamlEditor: YamlEditor;

  constructor(private spaceStore: SpaceStore, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.spaceStore.updateResource(this.space, resource).subscribe(
      () => this.router.navigate(['spaces']),
    );
  }
}
