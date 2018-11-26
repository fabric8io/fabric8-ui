import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  map,
  startWith
} from 'rxjs/operators';

import { Space } from 'ngx-fabric8-wit';
import { MySpacesItemService } from './my-spaces-item.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-item',
  styleUrls: ['./my-spaces-item.component.less'],
  templateUrl: './my-spaces-item.component.html',
  providers: [MySpacesItemService]
})
export class MySpacesItemComponent implements OnInit {

  @Input() space: Space;
  collaboratorCount: Observable<string>;
  workItemCount: Observable<string>;

  constructor(
    private readonly svc: MySpacesItemService
  ) { }

  ngOnInit(): void {
    this.collaboratorCount = this.svc.getCollaboratorCount(this.space)
      .pipe(
        map(String),
        startWith('-')
      );
    this.workItemCount = this.svc.getWorkItemCount(this.space)
      .pipe(
        map(String),
        startWith('-')
      );
  }

}
