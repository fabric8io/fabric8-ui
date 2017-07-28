import {Input, Component} from "@angular/core";
import {BuildConfig} from "../../../model/buildconfig.model";

@Component({
  selector: 'fabric8-buildconfig-view',
  templateUrl: './view.buildconfig.component.html',
  styleUrls: ['./view.buildconfig.component.scss'],
})
export class BuildConfigViewComponent {

  @Input() buildconfig: BuildConfig;
}
