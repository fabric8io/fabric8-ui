import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, UrlSegmentGroup, Route } from '@angular/router';

import { trimEnd } from 'lodash';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { ContextResolver } from './shared/context-resolver.service';


export function removeAction(url: string) {
  return trimEnd(url.replace(/\(action:[a-z-]*\)/, ''), '/');
}

export function viewBoard(segments: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (segments.length > 0) {
    let lastSegment = segments[segments.length - 1];
    if (lastSegment.parameterMap.has('view') && 'board' === lastSegment.parameterMap.get('view')) {
      return ({ consumed: segments });
    }
  }
}

export const routes: Routes = [

  // Only relevant locally, as the landing page sits on / in production
  {
    path: '',
    loadChildren: './landing-page/landing-page.module#LandingPageModule',
    pathMatch: 'full'
  },
  // Temporary page to control the app
  {
    path: '_control',
    loadChildren: './control/control.module#ControlModule'
  },

  // Home
  {
    path: '_home',
    loadChildren: './home/home.module#HomeModule'
  },

  // Getting started
  {
    path: '_gettingstarted',
    loadChildren: './getting-started/getting-started.module#GettingStartedModule'
  },

  // Error Pages
  {
    path: '_error',
    loadChildren: './error/error.module#ErrorModule'
  },
  // Profile
  {
    path: ':entity',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './profile/profile.module#ProfileModule'
  },

  // Settings
  {
    path: ':entity/_settings',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './settings/settings.module#SettingsModule'
  },

  // Spaces
  {
    path: ':entity/:space',
    resolve: {
      context: ContextResolver
    },
    children: [
      {
        matcher: viewBoard,
        loadChildren: './plan/board/board.module#BoardModule'
      }, {
        path: 'plan',
        loadChildren: './plan/plan.module#PlanModule'
      },
      {
        path: '',
        loadChildren: './analyze/analyze.module#AnalyzeModule'

      }
    ]
  },

  // Create
  {
    path: ':entity/:space/create',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './create/create.module#CreateModule'
  },

  // Space-settings
  {
    path: ':entity/:space/settings',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },
  {
    path: '**',
    redirectTo: '/_error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
