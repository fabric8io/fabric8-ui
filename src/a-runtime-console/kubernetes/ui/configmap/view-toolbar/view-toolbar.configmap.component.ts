import {Component, Input} from "@angular/core";
import {ConfigMap} from "../../../model/configmap.model";

@Component({
  selector: 'fabric8-configmap-view-toolbar',
  templateUrl: './view-toolbar.configmap.component.html',
  styleUrls: ['./view-toolbar.configmap.component.less'],
})
export class ConfigMapViewToolbarComponent {

  @Input() configmap: ConfigMap;

}
