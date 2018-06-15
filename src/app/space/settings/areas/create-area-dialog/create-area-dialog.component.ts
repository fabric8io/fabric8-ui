import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Area, AreaAttributes, AreaService } from 'ngx-fabric8-wit';
import { Subscription } from 'rxjs';

export enum AreaCreationStatus {
  OK,
  EMPTY_NAME_FAILURE,
  EXCEED_LENGTH_FAILURE,
  UNIQUE_VALIDATION_FAILURE
}

@Component({
  host: {
    'class': 'create-dialog'
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'create-area-dialog',
  templateUrl: './create-area-dialog.component.html',
  styleUrls: ['./create-area-dialog.component.less']
})

export class CreateAreaDialogComponent implements OnInit {

  @Input() host: ModalDirective;
  @Input() parentId: string;
  @Input() areas: Area[];
  @Output() onAdded = new EventEmitter<Area>();
  @ViewChild('areaForm') areaForm: NgForm;

  @ViewChild('rawInputField') rawInputField: ElementRef;
  @ViewChild('inputModel') inputModel: NgModel;

  // Declare the enum for usage in the template
  AreaCreationStatus: typeof AreaCreationStatus = AreaCreationStatus;

  name: string;
  private _areaCreationStatus: AreaCreationStatus;

  constructor(
    private areaService: AreaService) {
  }

  public onOpen() {
    this.focus();
  }

  public onClose() {
    this.clearField();
    this.resetErrors();
  }

  focus() {
    this.rawInputField.nativeElement.focus();
  }

  ngOnInit() {
    this.resetErrors();
  }

  clearField() {
    this.inputModel.reset();
  }

  resetErrors() {
    this._areaCreationStatus = AreaCreationStatus.OK;
  }

  validateAreaName(): void {
    this.resetErrors();
    if (this.name.trim().length === 0) {
      this._areaCreationStatus = AreaCreationStatus.EMPTY_NAME_FAILURE;
    }
    if (this.name.trim().length > 63) {
      this._areaCreationStatus = AreaCreationStatus.EXCEED_LENGTH_FAILURE;
    }
  }

  createArea() {
    let area = {} as Area;
    area.attributes = new AreaAttributes();
    area.attributes.name = this.name.trim();
    area.type = 'areas';
    this.areaService.create(this.parentId, area).subscribe(newArea => {
      this.onAdded.emit(newArea);
      this.host.hide();
    }, error => {
      this.handleError(error.json());
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
    this.host.hide();
  }

  handleError(error: any) {
    if (error.errors.length) {
      error.errors.forEach(error => {
        if (error.status === '409') {
          this._areaCreationStatus = AreaCreationStatus.UNIQUE_VALIDATION_FAILURE;
        }
      });
    }
  }

  get areaCreationStatus(): AreaCreationStatus {
    return this._areaCreationStatus;
  }

}
