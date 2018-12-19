import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from 'ngx-login-client';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.less'],
})
export class SwitchComponent {
  @Input() isChecked: Boolean;
  @Output() readonly onChecked = new EventEmitter();

  toggleSwitch(event) {
    this.onChecked.emit(event);
  }
}
