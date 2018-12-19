import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-widgets';
import { MySpacesSearchSpacesDialogSpaceItemModule } from './my-spaces-search-spaces-dialog-space-item/my-spaces-search-spaces-dialog-space-item.module';
import { MySpacesSearchSpacesDialog } from './my-spaces-search-spaces-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    ModalModule,
    MySpacesSearchSpacesDialogSpaceItemModule,
  ],
  declarations: [MySpacesSearchSpacesDialog],
  exports: [MySpacesSearchSpacesDialog],
})
export class MySpacesSearchSpacesDialogModule {}
