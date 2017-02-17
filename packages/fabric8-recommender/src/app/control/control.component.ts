import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthenticationService, User, UserService } from 'ng-login';

// import { ProfileService } from './../profile/profile.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'alm-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {

  }

  clearLocalStorage() {
    this.localStorageService.clearAll();
    this.flashMessagesService.show('Local storage successfully cleared', {cssClass: 'alert alert-success'});
  }

}
