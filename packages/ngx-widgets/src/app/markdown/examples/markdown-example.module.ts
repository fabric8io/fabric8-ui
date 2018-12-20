import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GitHubLinkAreaModule } from '../../github-link-area/github-link-area.module';
import { MarkdownModule } from '../markdown.module';
import { MarkdownExampleComponent, SafePipe } from './markdown-example.component';

@NgModule({
  declarations: [MarkdownExampleComponent, SafePipe],
  imports: [CommonModule, RouterModule, MarkdownModule, GitHubLinkAreaModule],
})
export class MarkdownExampleModule {
  constructor() {}
}
