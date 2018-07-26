import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppRoutingModule } from '../app-routing.module';
import { NavbarSideComponent } from './navbar-side.component';
import { NavbarTopComponent } from './navbar-top.component';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    AppRoutingModule,
    CollapseModule.forRoot(),
    CommonModule,
    FormsModule
  ],
  declarations: [NavbarComponent, NavbarSideComponent, NavbarTopComponent],
  exports: [NavbarComponent, NavbarSideComponent, NavbarTopComponent]
})
export class NavbarModule {}
