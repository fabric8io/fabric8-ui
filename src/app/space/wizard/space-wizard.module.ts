import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fabric8WitModule, UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';
import { initialState as spaceInitialState } from '../../shared/states/space.state';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SpaceEffects } from '../../shared/effects/space.effects';
import { SpaceReducer } from '../../shared/reducers/space.reducer';
import { AddSpaceOverlayModule } from '../add-space-overlay/add-space-overlay.module';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { TrustHtmlPipe, TrustStylePipe } from './pipes/safe-html.pipe';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';
import { VisibleItemsPipe } from './pipes/visible-items.pipe';
import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Fabric8WitModule,
    StoreModule.forFeature('fabric8-ui', {
      space: SpaceReducer
    }, {
      initialState: {space: spaceInitialState}
    }),
    EffectsModule.forFeature([SpaceEffects])
  ],
  declarations: [
    SpaceWizardComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective,
    SelectedItemsPipe,
    VisibleItemsPipe,
    TrustHtmlPipe,
    TrustStylePipe
  ],
  exports: [
    SpaceWizardComponent,
    UniqueSpaceNameValidatorDirective
  ],
  providers: [
    CodebasesService
  ]
})

export class SpaceWizardModule {

}
