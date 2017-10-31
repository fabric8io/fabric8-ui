import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective, Fabric8WitModule } from 'ngx-fabric8-wit';
import { SpaceWizardComponent } from './space-wizard.component';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';
import { VisibleItemsPipe } from './pipes/visible-items.pipe';
import { TrustHtmlPipe, TrustStylePipe } from './pipes/safe-html.pipe';
import { CodebasesService } from '../create/codebases/services/codebases.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Fabric8WitModule
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
