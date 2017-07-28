import {Input, Component} from "@angular/core";
import {Namespace} from "../../../model/namespace.model";

@Component({
  selector: 'fabric8-namespace-view',
  templateUrl: './view.namespace.component.html',
  styleUrls: ['./view.namespace.component.scss'],
})
export class NamespaceViewComponent {

  @Input() namespace: Namespace;
}
