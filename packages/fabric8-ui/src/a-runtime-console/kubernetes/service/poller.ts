import { BehaviorSubject, Observable, Subscription, timer as observableTimer } from 'rxjs';
import { Operation, ResourceOperation } from './resource-operation';

/**
 * A fallback if WebSockets doesn't work so we can't use the Watcher on a cluster
 * lets just poll in the background
 */
export class Poller<L> {
  protected subscription: Subscription;

  protected pollPeriod = 3000;

  protected resourceCache = {};

  constructor(
    protected pollListFactory: () => Observable<L>,
    private _dataStream: BehaviorSubject<any>,
  ) {
    this.lazyCreateSubscription();
  }

  get dataStream(): Observable<L> {
    return this._dataStream.asObservable();
  }

  /**
   * Forces recreation of the poller
   */
  recreate() {
    this.close();
    this.lazyCreateSubscription();
  }

  close() {
    this.closeSubscription();
  }

  protected closeSubscription() {
    const subscription = this.subscription;
    if (subscription) {
      this.subscription = null;
      subscription.unsubscribe();
    }
  }

  protected lazyCreateSubscription() {
    if (!this.subscription) {
      this.subscription = this.pollListFactory().subscribe(
        (msg) => {
          this.onListMessage(msg);
        },
        (err) => {
          this._dataStream.error(err);
        },
        () => {
          this.onSubscriptionClosed();
        },
      );
    }
  }

  protected onSubscriptionClosed() {
    // lets wait a bit then lets recreate the subscription
    observableTimer(this.pollPeriod).subscribe(() => {
      this.recreate();
    });
  }

  // TODO
  ngOnDestroy(): void {
    this.closeSubscription();
  }

  private onListMessage(list: any) {
    // lets convert the list into resource events
    const resourceCache = this.resourceCache;
    const newCache = {};
    if (list) {
      for (const obj of list) {
        const resource = obj.resource;
        if (resource) {
          let operation: ResourceOperation;
          const name = obj.name;
          if (name) {
            newCache[name] = resource;
            const old = resourceCache[name];
            if (old == undefined) {
              operation = new ResourceOperation(Operation.ADDED, resource);
            } else if (isNewerResource(resource, old)) {
              operation = new ResourceOperation(Operation.MODIFIED, resource);
            }
            this._dataStream.next(operation);
          }
        }
      }
    }
    for (const name in resourceCache) {
      if (newCache[name] == undefined) {
        const resource = resourceCache[name];
        if (resource != undefined) {
          this._dataStream.next(new ResourceOperation(Operation.DELETED, resource));
        }
      }
    }
    this.resourceCache = newCache;
  }
}

export function isNewerResource(resource: any, old: any): boolean {
  const oldRV = resourceVersion(old);
  const newRV = resourceVersion(resource);
  return newRV && (!oldRV || newRV !== oldRV);
}

function resourceVersion(resource: any): string {
  const obj = resource || {};
  const metadata = obj.metadata || {};
  return metadata.resourceVersion;
}
