import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import {
  IterationService as IterationServiceModel,
  IterationUI,
} from './../models/iteration.model';
import { HttpClientService } from './../shared/http-module/http.service';

@Injectable()
export class IterationService {
  constructor(private http: HttpClientService) {}

  /**
   * getIteration - We call this service method to fetch
   * @param iterationUrl - The url to get all the iteration
   * @return Promise of IterationModel[] - Array of iterations.
   */
  getIterations(iterationUrl): Observable<IterationServiceModel[]> {
    return this.http.get<{ data: IterationServiceModel[] }>(iterationUrl).pipe(
      map((r) => r.data),
      map((d) => this.resolveChildren(d)),
    );
  }

  /**
   * Create new iteration
   * @param iterationUrl - POST url
   * @param iteration - data to create a new iteration
   * @return new item
   */
  createIteration(
    url: string,
    iteration: IterationServiceModel,
  ): Observable<IterationServiceModel> {
    console.log('Create on iteration service.');
    return this.http
      .post<{ data: IterationServiceModel }>(url, { data: iteration })
      .pipe(map((r) => r.data));
  }

  /**
   * Update an existing iteration
   * @param iteration - Updated iteration
   * @return updated iteration's reference from the list
   */
  updateIteration(iteration: IterationServiceModel): Observable<IterationServiceModel> {
    console.log('Update on iteration service.');
    return this.http
      .patch<{ data: IterationServiceModel }>(iteration.links.self, { data: iteration })
      .pipe(map((r) => r.data));
  }

  isRootIteration(parentPath: string): boolean {
    return parentPath === '/';
  }

  /**
   * usage - Finds the children of an iteration
   * @param parent
   * @param iterations
   */
  private checkForChildIterations(
    parent: IterationServiceModel,
    iterations: IterationServiceModel[],
  ): IterationServiceModel[] {
    return iterations.filter((i) =>
      i.relationships.parent ? parent.id === i.relationships.parent.data.id : false,
    );
  }

  /**
   * takes all the iterations and resolve the children
   * @param data
   */
  private resolveChildren(iterations: IterationServiceModel[]): IterationServiceModel[] {
    return iterations.map((iteration) => {
      const childIterations = this.checkForChildIterations(iteration, iterations);
      if (childIterations.length > 0) {
        iteration.hasChildren = true;
        iteration.children = childIterations;
      }
      return iteration;
    });
  }

  getTopLevelIterations(iterations: IterationUI[]): IterationUI[] {
    let topLevelIterations = iterations.filter(
      (iteration) => iteration.parentPath.split('/').length - 1 === 1,
    );
    return topLevelIterations;
  }
}
