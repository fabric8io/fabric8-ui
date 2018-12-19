import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ContainerTogglerModule } from './container-toggler/container-toggler.module';
import { DialogModule } from './dialog/dialog.module';
import { DropdownModule } from './dropdown/dropdown.module';
import { AlmEditableModule } from './editable/almeditable.module';
import { AlmIconModule } from './icon/almicon.module';
import { InfiniteScrollModule } from './infinitescroll/infinitescroll.module';

import { AlmArrayFilter } from './pipes/alm-array-filter.pipe';
import { AlmAvatarSize } from './pipes/alm-avatar-size.pipe';
import { AlmLinkTarget } from './pipes/alm-link-target.pipe';
import { AlmMomentTime } from './pipes/alm-moment-time.pipe';
import { AlmSearchHighlightModule } from './pipes/alm-search-highlight.module';
import { AlmSearchHighlight } from './pipes/alm-search-highlight.pipe';
import { AlmTrim } from './pipes/alm-trim';
import { ArrayCount } from './pipes/arrayCount.pipe';

import { MarkdownModule } from './markdown/markdown.module';

@NgModule({
  imports: [FormsModule, AlmSearchHighlightModule],
  declarations: [AlmArrayFilter, AlmAvatarSize, AlmLinkTarget, AlmMomentTime, AlmTrim, ArrayCount],
  exports: [
    AlmArrayFilter,
    AlmAvatarSize,
    AlmLinkTarget,
    AlmMomentTime,
    AlmSearchHighlight,
    AlmTrim,
    ArrayCount,
    AlmEditableModule,
    AlmIconModule,
    ContainerTogglerModule,
    DialogModule,
    DropdownModule,
    InfiniteScrollModule,
    MarkdownModule,
  ],
})
export class WidgetsModule {
  // static forRoot(providedLoader: any = {
  //   provide: TranslateLoader,
  //   useFactory: translateLoaderFactory,
  //   deps: [Http]
  // }): ModuleWithProviders {
  //   return {
  //     ngModule: WidgetsModule,
  //     providers: [
  //       providedLoader,
  //       TranslateService,
  //       { provide: TranslateParser, useClass: DefaultTranslateParser }
  //     ]
  //   };
  // }
}
