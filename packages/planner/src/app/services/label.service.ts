import { Component, Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { map } from 'rxjs/operators';

import { LabelModel } from '../models/label.model';
import { HttpClientService } from './../shared/http-module/http.service';

@Injectable()
export class LabelService {
  constructor(private http: HttpClientService) {}

  /**
   * getLabels - We call this service method to fetch all labels in currect space
   * @return Observable of LabelModel[] - Array of labels.
   * Url - http://localhost:8080/api/spaces/829d2039-3929-4e8e-865b-fd463b8b34f1/labels/
   */
  getLabels(labelUrl): Observable<LabelModel[]> {
    return this.http.get<{ data: LabelModel[] }>(labelUrl).pipe(map((r) => r.data));
  }

  createLabel(label: LabelModel, url: string): Observable<LabelModel> {
    return this.http.post<{ data: LabelModel }>(url, { data: label }).pipe(map((r) => r.data));
  }
}
