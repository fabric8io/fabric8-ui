import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {BuildService} from "../../../service/build.service";
import {YamlEditor} from "../../../view/yaml.editor";
import {Build} from "../../../model/build.model";

@Component({
  selector: 'fabric8-build-edit-toolbar',
  templateUrl: './edit-toolbar.build.component.html',
  styleUrls: ['./edit-toolbar.build.component.scss'],
})
export class BuildEditToolbarComponent {

  @Input() build: Build;

  @Input() yamlEditor: YamlEditor;

  constructor(private buildService: BuildService, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.buildService.updateResource(this.build, resource).subscribe(
      () => this.router.navigate(['builds']),
    );
  }
}
