import { Component, Input } from "@angular/core";

@Component({
  selector: 'build-status-icon',
  templateUrl: './build-status-icon.component.html'
})
export class BuildStatusIconComponent {

  @Input() status: String;

}
