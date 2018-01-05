import { Input, Component } from "@angular/core";
import { Pod } from "../../../model/pod.model";

@Component({
  selector: 'fabric8-pod-view',
  templateUrl: './view.pod.component.html',
  styleUrls: ['./view.pod.component.less']
})
export class PodViewComponent {

  @Input() pod: Pod;
}
