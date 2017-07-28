import {Component, Input} from "@angular/core";

@Component({
  selector: 'build-status-icon',
  templateUrl: './build-status-icon.component.html',
  styleUrls: ['./build-status-icon.component.scss'],
})
export class BuildStatusIconComponent {

  @Input() status: String;

}
