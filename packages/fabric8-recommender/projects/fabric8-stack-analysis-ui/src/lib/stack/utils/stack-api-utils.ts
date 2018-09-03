import { Observable } from 'rxjs';
import {StackReportModel} from '../models/stack-report.model';

export function getStackReportModel(data: any): Observable<StackReportModel> {
    let result: any = data;
    return Observable.create((observer) => {
        let model: StackReportModel = result as StackReportModel;
        // Object.assign(model, result);
        observer.next(model);
        observer.complete();
    });
}
