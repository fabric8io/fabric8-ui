import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';

import { Environment } from '../models/environment';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent implements OnInit {

  @Input() spaceId: string;
  @Input() environment: Environment;

  memUnit: Observable<string>;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.memUnit = this.deploymentsService.getMemoryStat(this.spaceId, this.environment.environmentId)
      .first()
      .map(stat => stat.units);
  }

}
