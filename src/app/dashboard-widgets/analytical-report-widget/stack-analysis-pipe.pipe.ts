import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filter'
})

/*
 *  A generic filter that gives you the filtered output
 */

@Injectable()
export class StackAnalysisPipe implements PipeTransform {
    public transform(items: Array<any>): Array<any> {
        if (!items) {
            return [];
        }
        return items.filter(item => {
            let returnStatement: boolean = false;
            if (item && item.interestingBuilds && item.interestingBuilds.length > 0) {
                for (let build of item.interestingBuilds) {
                    if (build.annotations['fabric8.io/bayesian.analysisUrl']) {
                        returnStatement = true;
                        break;
                    }
                }
            }
            return returnStatement;
        });
    }
}
