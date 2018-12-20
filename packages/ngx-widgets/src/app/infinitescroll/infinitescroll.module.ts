import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InfiniteScrollDirective } from './infinitescroll.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [InfiniteScrollDirective],
  exports: [InfiniteScrollDirective],
})
export class InfiniteScrollModule {}
