import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { trimEnd } from 'lodash';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { ContextResolver } from './shared/context-resolver.service';
import { ExperimentalFeatureGuard } from './shared/experimental-feature.guard';
import { ExperimentalFeatureResolver } from './shared/experimental-feature.resolver';
import { ProfileResolver } from './shared/profile-resolver.service';


export function removeAction(url: string) {
  return trimEnd(url.replace(/\(action:[a-z-]*\)/, ''), '/');
}

export const routes: Routes = [

  // Only relevant locally, as the landing page sits on / in production
  {
    path: '',
    loadChildren: './landing-page/landing-page.module#LandingPageModule',
    pathMatch: 'full'
  },

  // Home
  {
    path: '_home',
    loadChildren: './home/home.module#HomeModule',
    data: {
      title: 'Home'
    }
  },

  // Getting started
  {
    path: '_gettingstarted',
    loadChildren: './getting-started/getting-started.module#GettingStartedModule',
    data: {
      title: 'Getting Started'
    }
  },

  // Error Pages
  {
    path: '_error',
    loadChildren: './layout/error/error.module#ErrorModule',
    data: {
      title: 'Error'
    }
  },
  // Profile
  {
    path: '_profile',
    resolve: {
      context: ProfileResolver
    },
    loadChildren: './profile/profile.module#ProfileModule',
    data: {
      title: 'Profile'
    }
  },

  {
    path: ':entity',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './profile/profile.module#ProfileModule',
    data: {
      title: 'Profile'
    }
  },

  // Analyze
  {
    path: ':entity/:space',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './space/analyze/analyze.module#AnalyzeModule',
    data: {
      title: 'Analyze'
    }
  },

  // Plan
  {
    path: ':entity/:space/plan',
    resolve: {
      context: ContextResolver,
      featureFlagConfig: ExperimentalFeatureResolver
    },
    loadChildren: './space/plan/plan.module#PlanModule',
    data: {
      title: 'Plan: Backlog',
      featureName: 'Planner'
    }
  },

  // Plan board
  {
    path: ':entity/:space/plan/board',
    resolve: {
      context: ContextResolver,
      featureFlagConfig: ExperimentalFeatureResolver
    },
    loadChildren: './space/plan/board/board.module#BoardModule',
    data: {
      title: 'Plan: Board',
      featureName: 'Planner'
    }
  },

  // Plan details
  {
    path: ':entity/:space/plan/detail',
    resolve: {
      context: ContextResolver,
      featureFlagConfig: ExperimentalFeatureResolver
    },
    loadChildren: './space/plan/detail/detail.module#DetailModule',
    data: {
      title: 'Plan: Detail',
      featureName: 'Planner'
    }
  },

  // Create
  {
    path: ':entity/:space/create',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './space/create/create.module#CreateModule',
    data: {
      title: 'Create'
    }
  },

  // Space-settings
  {
    path: ':entity/:space/settings',
    resolve: {
      context: ContextResolver
    },
    loadChildren: './space/settings/space-settings.module#SpaceSettingsModule',
    data: {
      title: 'Areas'
    }
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
