import {
  Component,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input } from '@angular/core';
import { AboutService } from '../shared/about.service';

@Component({
  selector: 'fab-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent {

  @ViewChild('aboutModal') aboutModal: any;

  constructor(public about: AboutService) {
    console.log(about.buildNumber, ' :modal ', about.buildTimestamp);
  }

  openAboutModal(event: any) {
    event.stopPropagation();
    this.aboutModal.open();
  }
}
