import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportCsvComponent } from './export-csv.component';
import { FilterService } from '../../services/filter.service';
import { SpaceQuery } from '../../models/space';
import { NgLetModule } from '../../shared/ng-let';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [CommonModule, NgLetModule, TooltipModule],
  declarations: [ExportCsvComponent],
  exports: [ExportCsvComponent],
  providers: [FilterService, SpaceQuery],
})
export class ExportCsvModule {}
