import {Input, Component} from "@angular/core";
import {BuildConfig} from "../../../model/buildconfig.model";

@Component({
  selector: 'fabric8-pipeline-view',
  templateUrl: './view.pipeline.component.html',
  styleUrls: ['./view.pipeline.component.scss'],
})
export class PipelineViewComponent {

  @Input() pipeline: BuildConfig;
}
