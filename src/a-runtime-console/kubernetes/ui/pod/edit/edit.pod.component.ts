import { Input, Component } from "@angular/core";
import { Pod } from "../../../model/pod.model";
import { YamlEditor } from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-pod-edit',
  templateUrl: './edit.pod.component.html',
})
export class PodEditComponent {

  @Input() pod: Pod;

  @Input() yamlEditor: YamlEditor;

}
