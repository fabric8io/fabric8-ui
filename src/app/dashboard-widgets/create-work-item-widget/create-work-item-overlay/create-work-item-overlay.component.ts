import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { removeAction } from '../../../app-routing.module';
import { DummyService } from './../shared/dummy.service';

// TODO HACK
import { WorkItemDetailAddTypeSelectorWidgetComponent } from 'fabric8-planner/app/components/work-item-create/work-item-create-selector/work-item-create-selector.component';
import { WorkItemType } from 'fabric8-planner/app/models/work-item-type';
import { WorkItemService } from 'fabric8-planner/app/services/work-item.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-create-work-item-overlay',
  templateUrl: './create-work-item-overlay.component.html'
})
export class CreateWorkItemOverlayComponent implements OnDestroy, OnInit, AfterViewInit {
  workItemSubscription: Subscription;
  workItemTypes: Observable<any[]>;
  space: Space;

  @ViewChild('detailAddTypeSelector') overlay: WorkItemDetailAddTypeSelectorWidgetComponent;

  constructor(private router: Router,
              private spaces: Spaces,
              private broadcaster: Broadcaster,
              private workItemService: WorkItemService) {
    this.workItemSubscription = this.spaces.current.subscribe(space => {
      this.space = space;
      this.workItemTypes = this.workItemService.getWorkItemTypes2(this.space.relationships.workitemtypes.links.related);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.workItemSubscription !== undefined) {
      this.workItemSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.overlay.open();
    }, 10);
  }

  onClose() {
    this.router.navigateByUrl(removeAction(this.router.url));
  }

  onSelect(workItemType: WorkItemType) {
    this.router
      .navigateByUrl(`/${this.space.relationalData.creator.attributes.username}/${this.space.attributes.name}/plan/detail/new?type=${workItemType.id}`);
  }

}
