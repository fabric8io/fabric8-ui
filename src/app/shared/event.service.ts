import { Injectable } from '@angular/core';

import { Space } from 'ngx-fabric8-wit';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EventService {

  public deleteSpaceSubject = new BehaviorSubject<Space>({} as Space); // By default the list mode is true
  constructor() {}

}
