import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import {FeatureToggleExampleComponent} from './feature-toggle/feature-toggle.example.component';

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
    component: WelcomeComponent
  }, {
    path: 'FeatureTogglesService',
    component: WelcomeComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
