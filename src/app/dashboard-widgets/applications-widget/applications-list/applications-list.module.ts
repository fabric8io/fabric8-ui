import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicationsListItemModule } from '../applications-list-item/applications-list-item.module';
import { ApplicatonsListComponent } from './applicatons-list.component';

@NgModule({
  imports: [
    ApplicationsListItemModule,
    CommonModule,
    FormsModule
  ],
  declarations: [ApplicatonsListComponent],
  exports: [ApplicatonsListComponent]
})
export class ApplicationsListModule { }
