import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Modal } from 'ngx-modal';
import { Context, AreaService, Area, AreaAttributes } from 'ngx-fabric8-wit';
import { ContextService } from '../../../shared/context.service';

@Component({
  host: {
    'class': 'create-dialog'
  },
  selector: 'create-area-dialog',
  templateUrl: './create-area-dialog.component.html',
  styleUrls: ['./create-area-dialog.component.less']
})
export class CreateAreaDialogComponent implements OnInit, OnDestroy {

  @Input() host: Modal;
  @Input() parentId: string;
  @Input() areas: Area[];
  @Output() onAdded = new EventEmitter<Area>();

  private context: Context;
  private openSubscription: Subscription;
  private name: string;

  constructor(
    private contexts: ContextService,
    private areaService: AreaService) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.openSubscription = this.host.onOpen.subscribe(() => {
      this.name = '';
    })
  }

  ngOnDestroy() {
    this.openSubscription.unsubscribe();
  }

  createArea () {
    let area = {} as Area;
    area.attributes = new AreaAttributes();
    area.attributes.name = this.name;
    area.type = "areas";
    this.areaService.create(this.parentId, area).subscribe(newArea => {
      this.onAdded.emit(newArea);
      this.host.close();
    });
  }

  itemPath(item: AreaAttributes) {
    // remove slash from start of string
    let parentPath = item.parent_path_resolved.slice(1, item.parent_path_resolved.length);
    if (parentPath === '') {
      return item.name;
    }
    return parentPath + '/' + item.name;
  }

  cancel() {
    this.host.close();
  }
}
