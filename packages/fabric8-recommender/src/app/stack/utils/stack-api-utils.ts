import {Observable} from 'rxjs';

function stackApiUtils(data: any, target: string): Observable<any> {
    let observable: Observable<any> = null;
    observable = Observable.create((observer) => {
        if (data) {
            let result: any = {};
            if (target === 'RECOM') {
                if (data.hasOwnProperty('recommendation')) {
                    result['recommendation'] = data.recommendation;
                }
            } else if (target === 'RESULT') {
                if (data.hasOwnProperty('result')) {
                    result['result'] = data.result;
                }
            } else if (target === 'ALL') {
                if (data.hasOwnProperty('recommendations')) {
                    result['recommendation'] = data.recommendations;
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
    let recommendationsObservable: Observable<any> = stackApiUtils(data, 'RECOM');
    let resultObservable: Observable<any> = null;
    if (recommendationsObservable) {
        recommendationsObservable.subscribe((result) => {
            let recommendations: any = result.recommendation;
            if (recommendations && recommendations.hasOwnProperty('recommendations')) {
                let recommendation: any = recommendations.recommendations;
                if (recommendation) {
                    let similarStacks = recommendation.similar_stacks;
                    similarStacks = similarStacks.length > 0 ? similarStacks[0] : null;
                    let resultObject: any = {};
                    if (similarStacks) {
                        const analysis: any = similarStacks.analysis;
                        let missingPackages: Array<any> = analysis.missing_packages;
                        let versionMismatch: Array<any> = analysis.version_mismatch;
                        let similarity: number = similarStacks.similarity;
                        let source: string = similarStacks.source;
                        let stackId: string = similarStacks.stack_id;
                        let stackName: string = similarStacks.stack_name;
                        let usage: number = similarStacks.usage;
                        resultObject = {
                            missing: missingPackages,
                            version: versionMismatch,
                            similarity: similarity,
                            source: source,
                            stackId: stackId,
                            stackName: stackName,
                            usage: usage
                        };
                        resultObservable = Observable.create((observer) => {
                            observer.next(resultObject);
                            observer.complete();
                        });
                    }
                }
            }
        });
    }
    return resultObservable;
}

/**
 * getResultInformation - A function that gets the data from the stack analysis API
 * parses accordingly to get only result information.
 *
 * This function can be reused across as it returns an observable.
 *
 * Input: data of type 'any'
 * Ouput: Observable of type 'any'
 */
export function getResultInformation(data: any): Observable<any> {
    let resultObservable: Observable<any> = stackApiUtils(data, 'RESULT');
    let resultInfo: Observable<any> = null;
    if (resultObservable) {
        resultObservable.subscribe((information) => {
            if (information && information.hasOwnProperty('result') && information.result.length > 0) {
                let stackResult: Array<any> = information.result;
                let result: any = {
                    components: stackResult[0].components,
                    distinctLicenses: stackResult[0].distinct_licenses,
                    popularity: stackResult[0].popularity,
                    ecosystem: stackResult[0].ecosystem,
                    manifest: stackResult[0].manifest_name,
                    totalLicenses: stackResult[0].total_licenses
                };
                resultInfo = Observable.create((observer) => {
                    observer.next(result);
                    observer.complete();
                });
            }
        });
    }
    return resultInfo;
}
