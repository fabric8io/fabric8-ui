import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ResourceHeaderComponent } from '../kubernetes/components/resource-header/resource.header.component';
import { OnLogin } from '../shared/onlogin.service';
import { EntriesPipe } from './entries.pipe';
import { LoadingComponent } from './loading/loading.component';
import { ParentLinkFactory } from './parent-link-factory';
import { SafeUrlPipe } from './safeurl.pipe';
import { TruncateCharactersPipe } from './truncate-characters.pipe';
import { TruncateWordsPipe } from './truncate-words.pipe';

@NgModule({
  imports: [BsDropdownModule.forRoot(), CommonModule, RouterModule, OAuthModule.forRoot()],
  declarations: [
    EntriesPipe,
    TruncateCharactersPipe,
    TruncateWordsPipe,
    LoadingComponent,
    ResourceHeaderComponent,
    SafeUrlPipe,
  ],
  exports: [
    EntriesPipe,
    TruncateCharactersPipe,
    TruncateWordsPipe,
    LoadingComponent,
    ResourceHeaderComponent,
    SafeUrlPipe,
  ],
  providers: [BsDropdownConfig, ParentLinkFactory, OnLogin],
})
export class Fabric8CommonModule {}
