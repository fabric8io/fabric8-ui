import { Input, Component } from "@angular/core";
import { Service } from "../../../model/service.model";
import { YamlEditor } from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-service-edit',
  templateUrl: './edit.service.component.html',
})
export class ServiceEditComponent {

  @Input() service: Service;

  @Input() yamlEditor: YamlEditor;

}
