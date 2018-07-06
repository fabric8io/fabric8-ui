import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { FeatureToggleExampleComponent } from './feature-toggle/feature-toggle.example.component';
import { FeatureToggleLoaderExampleComponent } from './feature-toggle-loader/feature-toggle-loader.example.component';
import { FeatureToggleServiceExampleComponent } from './feature-toggle-service/feature-toggle-service.example.component';

const routes: Routes = [{
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full'
  }, {
    path: 'welcome',
    component: WelcomeComponent
  }, {
    path: 'f8-feature-toggle',
    component: FeatureToggleExampleComponent
  }, {
    path: 'f8-feature-toggle-loader',
    component: FeatureToggleLoaderExampleComponent
  }, {
    path: 'FeatureTogglesService',
    component: FeatureToggleServiceExampleComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
