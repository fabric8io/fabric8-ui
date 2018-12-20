import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlmEditableModule } from '../editable/almeditable.module';
import { GitHubLinkAreaModule } from '../github-link-area/github-link-area.module';
import { MarkdownComponent } from './markdown.component';

@NgModule({
  declarations: [MarkdownComponent],
  imports: [CommonModule, AlmEditableModule, GitHubLinkAreaModule],
  exports: [MarkdownComponent],
})
export class MarkdownModule {}
