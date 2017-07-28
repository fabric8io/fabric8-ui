import {Input, Component} from "@angular/core";
import {Space} from "../../../model/space.model";
import {YamlEditor} from "../../../view/yaml.editor";

@Component({
  selector: 'fabric8-space-edit',
  templateUrl: './edit.space.component.html',
  styleUrls: ['./edit.space.component.scss'],
})
export class SpaceEditComponent {

  @Input() space: Space;

  @Input() yamlEditor: YamlEditor;

}

