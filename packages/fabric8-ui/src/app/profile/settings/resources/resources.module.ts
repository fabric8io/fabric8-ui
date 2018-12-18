import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResourceStatusIcon } from './resource-status-icon.component';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';

@NgModule({
  imports: [CommonModule, ResourcesRoutingModule],
  declarations: [ResourcesComponent, ResourceStatusIcon],
})
export class ResourcesModule {}
