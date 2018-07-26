import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IncludeContentComponent } from './includeContent.component';
import { IncludeMarkdownComponent } from './includeMarkdown.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    IncludeContentComponent,
    IncludeMarkdownComponent
  ],
  declarations: [
    IncludeContentComponent,
    IncludeMarkdownComponent
  ]
})
export class DemoComponentsModule {
  constructor() {}
}
