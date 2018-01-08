import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Area, AreaAttributes, AreaService, Context } from 'ngx-fabric8-wit';
import { EmptyStateConfig, ListConfig } from 'patternfly-ng';
import { Subscription } from 'rxjs';

import { ContextService } from '../../../shared/context.service';
import { IModalHost } from '../../wizard/models/modal-host';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-areas',
  templateUrl: 'areas.component.html',
  styleUrls: ['./areas.component.less']
})
export class AreasComponent implements OnInit, OnDestroy {
  private context: Context;
  private areas: Area[];
  private emptyStateConfig: EmptyStateConfig;
  private listConfig: ListConfig;
  private areaSubscription: Subscription;
  private selectedAreaId: string;
  @ViewChild('createArea') createArea: IModalHost;

  constructor(
    private contexts: ContextService,
    private areaService: AreaService) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.listConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;

    this.areaSubscription = this.areaService.getAllBySpaceId(this.context.space.id).subscribe(areas => {
      this.selectedAreaId = this.context.space.id;
      areas.forEach((area) => {
        if (area.attributes.parent_path == '/') {
          this.selectedAreaId = area.id;
        }
      });
      this.areas = areas;
    });
  }

  ngOnDestroy() {
    this.areaSubscription.unsubscribe();
  }

  addChildArea(id: string) {
    if (id) {
      this.selectedAreaId = id;
    }
    this.createArea.open();
  }

  itemPath(item: AreaAttributes) {
    // remove slash from start of string
    let parentPath = item.parent_path_resolved.slice(1, item.parent_path_resolved.length);
    if (parentPath === '') {
      return item.name;
    }
    return parentPath + '/' + item.name;
  }

  addArea(area: Area) {
    this.areas.push(area);
  }
}
