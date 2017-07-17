import { Observable } from 'rxjs';

function stackApiUtils(data: any, target: string): Observable<any> {
    let observable: Observable<any> = null;
    observable = Observable.create((observer) => {
        if (data) {
            let result: any = {};
            result['finishedTime'] = data.finished_at;
            result['requestId'] = data.request_id;
            result['schema'] = data.schema;
            result['startedTime'] = data.started_at;
            if (target === 'RECOM') {
                if (data.hasOwnProperty('recommendation')) {
                    result['recommendation'] = data.recommendation;
                }
            } else if (target === 'RESULT') {
                if (data.hasOwnProperty('result')) {
                    result['result'] = data.result;
                }
            } else if (target === 'ALL') {
                if (data.hasOwnProperty('recommendation')) {
                    result['recommendation'] = data.recommendation;
                }
                if (data.hasOwnProperty('result')) {
                    result['result'] = data.result;
                }
            }
            observer.next(result);
        }
        observer.complete();
    });
    return observable;
}

/**
 * getStackRecommendations - A function that gets the data from the stack analysis API
 * parses accordingly to get only recommendations.
 *
 * This function can be reused across as it returns an observable.
 *
 * Input: data of type 'any'
 * Ouput: Observable of type 'any'
 */
export function getStackRecommendations(data: any): Observable<any> {
    let recommendationsObservable: Observable<any> = stackApiUtils(data, 'ALL');
    let resultObservable: Observable<any> = null;
    if (recommendationsObservable) {
        recommendationsObservable.subscribe((information) => {
            let finishedTime = information['finishedTime'];
            let requestId = information['requestId'];
            let schema = information['schema'];
            let startedTime = information['startedTime'];

            let recommendation: any = information.recommendation;
            if (recommendation &&
                recommendation.hasOwnProperty('recommendations') &&
                recommendation['recommendations'] &&
                recommendation['recommendations'].length) {
                let resultObj: any = {};
                let recommendations: Array<any> = recommendation['recommendations'];
                recommendations.forEach(recommendationItem => {
                    let recommendationObj = {};
                    let similarStacks = recommendationItem.similar_stacks;
                    similarStacks = similarStacks.length > 0 ? similarStacks[0] : null;
                    if (similarStacks) {
                        const analysis: any = similarStacks.analysis;
                        recommendationObj = {
                            missing: analysis.missing_packages,
                            version: analysis.version_mismatch,
                            similarity: similarStacks.similarity,
                            source: similarStacks.source,
                            stackId: similarStacks.stack_id,
                            stackName: similarStacks.stack_name,
                            usage: similarStacks.usage,
                            finishedTime: finishedTime,
                            requestId: requestId,
                            schema: schema,
                            startedTime: startedTime
                        };
                    }
                    let path = recommendationItem['manifest_file_path'];
                    resultObj[path] = recommendationObj;
                });
                resultObservable = Observable.create((observer) => {
                    observer.next(resultObj);
                    observer.complete();
                });
            }
        });
    }
    return resultObservable;
}

/**
 * getStackData - A function that gets the data from the stack analysis API
 * parses accordingly to get only result information.
 *
 * This function can be reused across as it returns an observable.
 *
 * Input: data of type 'any'
 * Ouput: Observable of type 'any'
 */
export function getResultInformation(data: any): Observable<any> {
    let stackObservable: Observable<any> = stackApiUtils(data, 'RESULT');
    let resultObservable: Observable<any> = null;
    if (stackObservable) {
        stackObservable.subscribe((information) => {
            if (information && information.hasOwnProperty('result') &&
                information.result.length &&
                information.result[0].stack_data &&
                information.result[0].stack_data.length) {
                let stackItems: Array<any> = information.result[0].stack_data;
                let resultObj: any = {};
                stackItems.forEach(stackItem => {
                    let stackObj = {};
                    stackObj = {
                        components: stackItem.components,
                        distinctLicenses: stackItem.distinct_licenses,
                        popularity: stackItem.popularity,
                        ecosystem: stackItem.ecosystem,
                        manifest: stackItem.manifest_name,
                        totalLicenses: stackItem.total_licenses
                    };
                    let path = stackItem['manifest_file_path'];
                    resultObj[path] = stackObj;
                });
                resultObservable = Observable.create((observer) => {
                    observer.next(resultObj);
                    observer.complete();
                });
            }
        });
    }
    return resultObservable;
}
