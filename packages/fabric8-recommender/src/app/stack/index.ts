import { NgModule } from '@angular/core';

import { StackDetailsModule } from './stack-details/stack-details.module';

@NgModule({
  imports: [
    StackDetailsModule
  ],
  exports: [
    StackDetailsModule
  ]
})
export class FabricStackAnalysisModule {
  constructor() {}
}
