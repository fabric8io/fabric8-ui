import {
  Component,
  Input
} from '@angular/core';

import { Codebase } from '../../../space/create/codebases/services/codebase';

@Component({
  selector: 'fabric8-add-codebase-widget-codebase-item',
  templateUrl: './codebase-item.component.html',
  styleUrls: ['./codebase-item.component.less']
})
export class CodebaseItemComponent {
  @Input() codebase: Codebase;
}
