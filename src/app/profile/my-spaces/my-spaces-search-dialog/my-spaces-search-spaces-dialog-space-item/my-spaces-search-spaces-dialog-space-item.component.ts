import {
  Component,
  Input
} from '@angular/core';
import { Space } from 'ngx-fabric8-wit';

@Component({
  selector: 'my-spaces-search-spaces-dialog-space-item',
  templateUrl: './my-spaces-search-spaces-dialog-space-item.component.html',
  styleUrls: ['./my-spaces-search-spaces-dialog-space-item.component.less']
})
export class MySpacesSearchSpacesDialogSpaceItemComponent {
  @Input() space: Space;
}
