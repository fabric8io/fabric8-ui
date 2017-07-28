import {Component, Input} from "@angular/core";
import {Pod} from "../../../model/pod.model";

@Component({
  selector: 'fabric8-pod-view-toolbar',
  templateUrl: './view-toolbar.pod.component.html',
  styleUrls: ['./view-toolbar.pod.component.scss'],
})
export class PodViewToolbarComponent {

  @Input() pod: Pod;

}
