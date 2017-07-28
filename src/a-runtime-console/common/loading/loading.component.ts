import { Component, Input } from '@angular/core';

@Component({
  selector: 'fabric8-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {

  @Input() loading: boolean;

}
