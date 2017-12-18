import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent implements OnInit {

  @Input() spaceId: string;
  @Input() environmentId: string;

  memUnit: Observable<string>;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.memUnit = this.deploymentsService.getMemoryStat(this.spaceId, this.environmentId)
      .first()
      .map(stat => stat.units);
  }

}
