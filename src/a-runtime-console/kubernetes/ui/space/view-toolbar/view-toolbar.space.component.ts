import {Component, Input} from "@angular/core";
import {Space} from "../../../model/space.model";

@Component({
  selector: 'fabric8-space-view-toolbar',
  templateUrl: './view-toolbar.space.component.html',
  styleUrls: ['./view-toolbar.space.component.scss'],
})
export class SpaceViewToolbarComponent {

  @Input() space: Space;

}
