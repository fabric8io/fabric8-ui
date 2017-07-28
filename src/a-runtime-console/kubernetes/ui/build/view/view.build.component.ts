import {Input, Component} from "@angular/core";
import {Build} from "../../../model/build.model";

@Component({
  selector: 'fabric8-build-view',
  templateUrl: './view.build.component.html',
  styleUrls: ['./view.build.component.scss'],
})
export class BuildViewComponent {

  @Input() build: Build;
}
