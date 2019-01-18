import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
import { ResourceService, UsageSeverityEnvironmentStat } from '../services/resource.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'resources-component',
  templateUrl: 'resources.component.html',
  styleUrls: ['./resources.component.less'],
  providers: [ResourceService],
})
export class ResourcesComponent implements OnInit {
  data: UsageSeverityEnvironmentStat[];

  constructor(private readonly resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resourceService
      .getEnvironmentsWithScaleAndIcon()
      .pipe(first())
      .subscribe(
        (stats: UsageSeverityEnvironmentStat[]): void => {
          this.data = stats;
        },
      );
  }
}
