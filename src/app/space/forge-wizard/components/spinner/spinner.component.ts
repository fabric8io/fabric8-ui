import {Component, Input} from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styles: ['.loading { min-height: 450px }']
})
export class SpinnerComponent {

  @Input() loading: boolean;
}
