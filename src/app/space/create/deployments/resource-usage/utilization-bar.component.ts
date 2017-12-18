import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Stat } from '../models/stat';

import { Observable } from 'rxjs';

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html'
})
export class UtilizationBarComponent implements OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  constructor() { }

  ngOnInit(): void {
    this.stat.subscribe(val => {
      this.used = val.used;
      this.total = val.total;
      this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
      this.unusedPercent = 100 - this.usedPercent;
    });
  }
}
