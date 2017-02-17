import { TeamMembershipDialogComponent } from './team-membership-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TeamMembershipDialogComponent],
  exports: [TeamMembershipDialogComponent]
})
export class TeamMembershipDialogModule { }
