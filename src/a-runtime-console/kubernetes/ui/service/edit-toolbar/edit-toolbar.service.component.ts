import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { ServiceService } from "../../../service/service.service";
import { YamlEditor } from "../../../view/yaml.editor";
import { Service } from "../../../model/service.model";

@Component({
  selector: 'fabric8-service-edit-toolbar',
  templateUrl: './edit-toolbar.service.component.html',
  styleUrls: ['./edit-toolbar.service.component.less'],
})
export class ServiceEditToolbarComponent {

  @Input() service: Service;

  @Input() yamlEditor: YamlEditor;

  constructor(private serviceService: ServiceService, private router: Router) {
  }

  save() {
    let resource = this.yamlEditor.parseYaml();
    this.serviceService.updateResource(this.service, resource).subscribe(
      () => this.router.navigate(['services']),
    );
  }
}
