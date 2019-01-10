import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { LinkErrorModule } from './link-error/link-error.module';
import { HomeDashboardModule } from './home-dashboard/home-dashboard.module';
import { LoadingWidgetModule } from './../dashboard-widgets/loading-widget/loading-widget.module';

@NgModule({
  imports: [CommonModule, LinkErrorModule, HomeDashboardModule, LoadingWidgetModule],
  exports: [HomeComponent],
  declarations: [HomeComponent],
})
export class HomeModule {}
