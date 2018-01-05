import { Component, Input } from "@angular/core";
import { Namespace } from "../../../model/namespace.model";

@Component({
  selector: 'fabric8-namespace-view-toolbar',
  templateUrl: './view-toolbar.namespace.component.html',
  styleUrls: ['./view-toolbar.namespace.component.less']
})
export class NamespaceViewToolbarComponent {

  @Input() namespace: Namespace;

}
