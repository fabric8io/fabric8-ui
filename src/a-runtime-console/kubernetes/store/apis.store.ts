import { Restangular } from 'ng2-restangular';
import { KUBERNETES_RESTANGULAR } from './../service/kubernetes.restangular';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';

/**
 * Lets keep around the singleton results to avoid doing too many requests for this static data
 */
var _latestAPIs: APIs = null;

let _currentAPIs: BehaviorSubject<APIs> = new BehaviorSubject(_latestAPIs);
let _loadingAPIs: BehaviorSubject<boolean> = new BehaviorSubject(true);


// TODO lets default to OpenShift as a hack ;)
let _defaultIsOpenShift = true;

export class APIs {
  constructor(public isOpenShift: boolean) {
  }
}

export function isOpenShift(): boolean {
  let config = window['Fabric8UIEnv'];
  if (config) {
    let flag = config['kubernetesMode'];
    if (flag === 'true') {
      return false;
    }
  }

  if (_latestAPIs != null) {
    return _latestAPIs.isOpenShift;
  }
  return _defaultIsOpenShift;
}

@Injectable()
export class APIsStore {

  constructor(@Inject(KUBERNETES_RESTANGULAR) private kubernetesRestangular: Restangular, private http: Http) {
    this.load();
  }

  get resource(): Observable<APIs> {
    return _currentAPIs.asObservable();
  }

  get loading(): Observable<boolean> {
    return _loadingAPIs.asObservable();
  }

  /**
   * Returns whether we are running against openshift.
   *
   * NOTE this is intended to be invoked after the APIsStore has finished loading via the .loading() Observable<boolean>!
   *
   * @return {boolean} true if this cluster is using openshift
   */
  isOpenShift(): boolean {
    let apis = _latestAPIs;
    if (!apis) {
      console.log('WARNING: invoked the isOpenShift() method before the APIsStore has loaded!');
      return true;
    }
    return apis.isOpenShift;
  }

  load() {
/*
    // we only need to load once really on startup
    if (_startedLoadingAPIs) {
      return;
    }
    _startedLoadingAPIs = true;
    if (!_latestAPIs) {
      this.kubernetesRestangular.one('oapi').get()
        .subscribe(
          () => {
            _latestAPIs = new APIs(true);
            _currentAPIs.next(_latestAPIs);
            _loadingAPIs.next(false);
          },
          (error) => {
            console.log('Could not find /oapi but for now going to assume its openshift!');
            //console.log('Could not find /oapi so not OpenShift and must be Kubernetes: ' + error);
            _latestAPIs = new APIs(_defaultIsOpenShift);

            _currentAPIs.next(_latestAPIs);
            _loadingAPIs.next(false);
          });
    }
*/
  }
}
