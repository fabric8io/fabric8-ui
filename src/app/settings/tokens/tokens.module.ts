import { FormsModule } from '@angular/forms';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';


import { TokensComponent }     from './tokens.component';
import { TokensRoutingModule } from './tokens-routing.module';

@NgModule({
  imports:      [ CommonModule, TokensRoutingModule, FormsModule ],
  declarations: [ TokensComponent ]
})
export class TokensModule {
  constructor() {}
}
