import { Component, Input } from '@angular/core';
import { Space } from '../../../model/space.model';

@Component({
  selector: 'fabric8-space-view',
  templateUrl: './view.space.component.html'
})
export class SpaceViewComponent {

  @Input() space: Space;
}
