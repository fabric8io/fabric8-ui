import { Component, Input, Inject } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { SpaceQuery } from '../../models/space';
import { Observable, of, combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { EQUAL, AND } from '../../services/query-keys';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'export-csv',
  templateUrl: './export-csv.component.html',
})
export class ExportCsvComponent {
  @Input() isDisabled: boolean;

  constructor(
    private spaceQuery: SpaceQuery,
    private filterService: FilterService,
    private route: ActivatedRoute,
    @Inject(WIT_API_URL) private baseApiURL: string,
  ) {}

  public csvLink: Observable<string> = combineLatest(
    this.spaceQuery.getCurrentSpace.pipe(filter((s) => !!s)),
    this.route.queryParams.pipe(filter((q) => !!Object.keys(q).length)),
  ).pipe(
    switchMap(([space, query]) => {
      const currentQuery = this.filterService.queryToJson(query.q);
      const spaceQuery = this.filterService.queryBuilder('space', EQUAL, space.id);
      const expression = {
        expression: this.filterService.queryJoiner(currentQuery, AND, spaceQuery),
      };
      return of(
        this.baseApiURL +
          'search/workitems/csv?' +
          Object.keys(expression)
            .map((k) => 'filter[' + k + ']=' + encodeURIComponent(JSON.stringify(expression[k])))
            .join('&'),
      );
    }),
  );
}
