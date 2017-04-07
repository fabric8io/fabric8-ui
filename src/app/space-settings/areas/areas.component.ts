import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Context, AreaService, Area, AreaAttributes } from 'ngx-fabric8-wit';
import { ListViewConfig, EmptyStateConfig } from 'ngx-widgets';

import { ContextService } from '../../shared/context.service';

@Component({
  selector: 'alm-areas',
  templateUrl: 'areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit, OnDestroy {
  private context: Context;
  private areas: Area[];
  private emptyStateConfig: EmptyStateConfig;
  private listViewConfig: ListViewConfig;
  private areaSubscription: Subscription;
  private selectedAreaId: string;


  constructor(
    private contexts: ContextService,
    private areaService: AreaService) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.listViewConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showSelectBox: false,
      useExpandingRows: false
    } as ListViewConfig;

    this.areaSubscription = this.areaService.getAllBySpaceId(this.context.space.id).subscribe(areas => {
      this.areas = areas;
    });
  }

  ngOnDestroy() {
    this.areaSubscription.unsubscribe();
  }

  addChildArea(id: string) {
    this.selectedAreaId = id;
    console.log('adding child area:' + id);
    //launch modal with area in dialog
  }

  itemPath(item: AreaAttributes) {
    // remove slash from start of string
    let parentPath = item.parent_path_resolved.slice(1, item.parent_path_resolved.length);
    if (parentPath === '') {
      return item.name;
    }
    return parentPath + '/' + item.name;
  }
}
