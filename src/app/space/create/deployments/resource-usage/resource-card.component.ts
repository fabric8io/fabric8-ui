import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import { Environment } from '../models/environment';
import { DeploymentsService } from '../services/deployments.service';

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
    this.memUnit = this.deploymentsService.getMemoryStat(this.spaceId, this.environment.name)
      .first()
      .map(stat => stat.units);
  }

}
