import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureFlagResolver } from 'ngx-feature-flag';
import { ContextResolver } from './shared/context-resolver.service';
import { ProfileResolver } from './shared/profile-resolver.service';

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
    resolve: {
      featureFlagConfig: FeatureFlagResolver
    },
    loadChildren: './home/home.module#HomeModule',
    data: {
      title: 'Analyze',
      featureName: 'Analyze'
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

  //redirect status pages
  {
    path: '_redirects/:redirectType',
    loadChildren: './layout/redirect-status/redirect-status.module#RedirectStatusModule',
    data: {
      title: 'Redirect Status'
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

  // Feature Flag
  {
    path: '_featureflag',
    loadChildren: './feature-flag/toggles.module#TogglesModule',
    data: {
      title: 'Feature Flag'
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
      context: ContextResolver,
      featureFlagConfig: FeatureFlagResolver
    },
    loadChildren: './space/analyze/analyze.module#AnalyzeModule',
    data: {
      title: 'Analyze',
      featureName: 'Analyze'
    }
  },

  // Plan
  {
    path: ':entity/:space/plan',
    resolve: {
      context: ContextResolver,
      featureFlagConfig: FeatureFlagResolver
    },
    loadChildren: './space/plan/plan.module#PlanModule',
    data: {
      title: 'Plan: Backlog',
      featureName: 'Planner'
    }
  },

  // Create
  {
    path: ':entity/:space/create',
    resolve: {
      context: ContextResolver,
      featureFlagConfig: FeatureFlagResolver
    },
    loadChildren: './space/create/create.module#CreateModule',
    data: {
      title: 'Create',
      featureName: 'Codebases'
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

  // App Launcher
  {
    path: ':entity/:space/applauncher',
    resolve: {
      context: ContextResolver,
      featureFlagConfig: FeatureFlagResolver
    },
    loadChildren: './space/app-launcher/app-launcher.module#AppLauncherModule',
    data: {
      title: 'App Launcher',
      featureName: 'AppLauncher'
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
