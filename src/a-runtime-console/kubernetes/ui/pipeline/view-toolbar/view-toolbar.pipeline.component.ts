import {Component, Input} from "@angular/core";
import {BuildConfig} from "../../../model/buildconfig.model";

@Component({
  selector: 'fabric8-pipeline-view-toolbar',
  templateUrl: './view-toolbar.pipeline.component.html',
  styleUrls: ['./view-toolbar.pipeline.component.scss'],
})
export class PipelineViewToolbarComponent {

  @Input() pipeline: BuildConfig;

}
