import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MySpacesSearchSpacesDialogSpaceItemComponent } from './my-spaces-search-spaces-dialog-space-item.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [MySpacesSearchSpacesDialogSpaceItemComponent],
  declarations: [MySpacesSearchSpacesDialogSpaceItemComponent],
})
export class MySpacesSearchSpacesDialogSpaceItemModule {}
