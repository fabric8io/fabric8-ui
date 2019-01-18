import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap';
import { InfotipComponent } from './infotip.component';

@NgModule({
  imports: [CommonModule, PopoverModule.forRoot()],
  declarations: [InfotipComponent],
  exports: [InfotipComponent],
})
export class InfotipModule {}
