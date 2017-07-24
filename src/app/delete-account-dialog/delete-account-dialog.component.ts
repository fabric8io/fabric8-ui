import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.less']
})
export class DeleteAccountDialogComponent {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

  deleteAccount() {

  }

 }
