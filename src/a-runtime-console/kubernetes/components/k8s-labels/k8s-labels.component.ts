import { Component, Input } from "@angular/core";

@Component({
  selector: 'k8s-labels',
  templateUrl: './k8s-labels.component.html',
})
export class KubernetesLabelsComponent {

  @Input() labels: Map<String, String>;

}
