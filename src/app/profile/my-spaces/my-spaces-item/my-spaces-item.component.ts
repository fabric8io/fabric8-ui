import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Space } from 'ngx-fabric8-wit';
import { MySpacesItemService } from './my-spaces-item.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-item',
  styleUrls: ['./my-spaces-item.component.less'],
  templateUrl: './my-spaces-item.component.html',
  providers: [MySpacesItemService]
})
export class MySpacesItemComponent implements OnInit, OnDestroy {

  @Input() space: Space;
  collaboratorCount: string = '-';

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly svc: MySpacesItemService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.svc.getCollaboratorCount(this.space)
        .pipe(
          map((count: number): string => String(count))
        )
        .subscribe((count: string): void => {
          this.collaboratorCount = count;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
