import { Component, Input } from "@angular/core";
import { ReplicaSet } from "../../../model/replicaset.model";

@Component({
  selector: 'fabric8-replicaset-view-toolbar',
  templateUrl: './view-toolbar.replicaset.component.html',
  styleUrls: ['./view-toolbar.replicaset.component.less'],
})
export class ReplicaSetViewToolbarComponent {

  @Input() replicaset: ReplicaSet;

}
