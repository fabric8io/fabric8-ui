import {Component, Input} from "@angular/core";
import {Deployment} from "../../../model/deployment.model";

@Component({
  selector: 'fabric8-deployment-view-toolbar',
  templateUrl: './view-toolbar.deployment.component.html',
  styleUrls: ['./view-toolbar.deployment.component.scss'],
})
export class DeploymentViewToolbarComponent {

  @Input() deployment: Deployment;

}
