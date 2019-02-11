import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlmEditableModule } from '../editable/almeditable.module';
import { GitHubLinkAreaModule } from '../github-link-area/github-link-area.module';
import { MarkdownComponent } from './markdown.component';
import { AreaSizeModule } from '../area-size/area-size.module';

@NgModule({
  declarations: [MarkdownComponent],
  imports: [CommonModule, AlmEditableModule, GitHubLinkAreaModule, AreaSizeModule],
  exports: [MarkdownComponent],
})
export class MarkdownModule {}
