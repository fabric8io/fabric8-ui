import { EventEmitter, Output, Injectable } from '@angular/core';

@Injectable()
export class CommonService {
  @Output() inshortCardClicked = new EventEmitter < any > ();

  shortCardClicked() {
    this.inshortCardClicked.emit(true);
  }
}
