import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'loading-utilization-bar',
  templateUrl: 'loading-utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less']
})
export class LoadingUtilizationBarComponent {
  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
}
