import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { BuildConfigService } from "../../../service/buildconfig.service";
import { YamlEditor } from "../../../view/yaml.editor";
import { BuildConfig } from "../../../model/buildconfig.model";

@Component({
  selector: 'fabric8-buildconfig-edit-toolbar',
  templateUrl: './edit-toolbar.buildconfig.component.html',
  styleUrls: ['./edit-toolbar.buildconfig.component.less'],
})
export class BuildConfigEditToolbarComponent {

  @Input() buildconfig: BuildConfig;

  @Input() yamlEditor: YamlEditor;

  constructor(private buildconfigService: BuildConfigService, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.buildconfigService.updateResource(this.buildconfig, resource).subscribe(
      () => this.router.navigate(['buildconfigs']),
    );
  }
}
