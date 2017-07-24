import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';
import { removeAction } from '../../../app-routing.module';


// TODO HACK
import { WorkItemService } from 'fabric8-planner/app/services/work-item.service';
import { WorkItemType } from 'fabric8-planner/app/models/work-item-type';
import { WorkItemDetailAddTypeSelectorWidgetComponent } from 'fabric8-planner/app/components/work-item-create/work-item-create-selector/work-item-create-selector.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-create-work-item-overlay',
  templateUrl: './create-work-item-overlay.component.html',
  styleUrls: ['./create-work-item-overlay.component.less']
})
export class CreateWorkItemOverlayComponent implements OnInit, AfterViewInit {

  workItemTypes: Observable<any[]>;
  space: Space;

  @ViewChild('detailAddTypeSelector') overlay: WorkItemDetailAddTypeSelectorWidgetComponent;

  constructor(
    private router: Router,
    private spaces: Spaces,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService
  ) { }

  ngOnInit() {
    this.spaces.current.subscribe(space => this.space = space);
    this.workItemTypes = this.workItemService.getWorkItemTypes();
  }

  ngAfterViewInit() {
    this.overlay.open();
  }

  onClose() {
    this.router.navigateByUrl(removeAction(this.router.url));
  }

  onSelect(workItemType: WorkItemType) {
    this.router
      .navigateByUrl(`/${this.space.relationalData.creator.attributes.username}/${this.space.attributes.name}/plan/detail/new?type=${workItemType.id}`);
  }

}
