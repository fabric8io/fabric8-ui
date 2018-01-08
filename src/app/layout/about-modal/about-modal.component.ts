import {
  AfterViewInit,
  Component,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { AboutService } from '../../shared/about.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fab-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.less']
})
export class AboutModalComponent implements AfterViewInit {
  @ViewChild('staticModal') staticModal: any;

  constructor(
    public about: AboutService,
    public renderer: Renderer2
  ) {}

  ngAfterViewInit() {}

  open() {
    this.staticModal.show();
  }

}
