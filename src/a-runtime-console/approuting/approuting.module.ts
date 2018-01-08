import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { TokenResolver } from '../shared/token.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'run/spaces', resolve: { token: TokenResolver }, pathMatch: 'full' },
  { path: 'home', redirectTo: 'run/spaces', resolve: { token: TokenResolver }, pathMatch: 'full' },
  { path: 'run', resolve: { token: TokenResolver }, loadChildren: '../kubernetes/ui/ui.module#KubernetesUIModule' },
  { path: 'run/space/:space', resolve: { token: TokenResolver }, loadChildren: '../kubernetes/ui/ui.module#KubernetesUIModule' },
  { path: 'run/space/:space/app/:app', resolve: { token: TokenResolver }, loadChildren: '../kubernetes/ui/ui.module#KubernetesUIModule' },
  { path: 'run/space/:space/label/:label/app/:app', resolve: { token: TokenResolver }, loadChildren: '../kubernetes/ui/ui.module#KubernetesUIModule' },
  { path: 'run/space/:space/label/:label', resolve: { token: TokenResolver }, loadChildren: '../kubernetes/ui/ui.module#KubernetesUIModule' },
  { path: 'run/app/:app/space/:space', resolve: { token: TokenResolver }, loadChildren: '../kubernetes/ui/ui.module#KubernetesUIModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
