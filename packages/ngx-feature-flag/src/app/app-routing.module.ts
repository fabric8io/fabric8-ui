import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleLoaderExampleComponent } from './feature-toggle-loader/feature-toggle-loader.example.component';
import { FeatureToggleServiceExampleComponent } from './feature-toggle-service/feature-toggle-service.example.component';
import { FeatureToggleExampleComponent } from './feature-toggle/feature-toggle.example.component';
import { WelcomeComponent } from './welcome/welcome.component';

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
  },
  {
    path: 'f8-feature-toggle-warning',
    loadChildren: './feature-toggle-warning/warning.module#TogglesModule',
    data: {
      title: 'Feature Flag'
    }
  },
  {
    path: '_home',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
