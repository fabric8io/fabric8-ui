import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ResourceStatusIcon } from './resource-status-icon.component';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ResourcesRoutingModule
  ],
  declarations: [ ResourcesComponent, ResourceStatusIcon ]
})
export class ResourcesModule {}
