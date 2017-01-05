import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-signin',
  templateUrl: 'signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {}

  signin() {
    // Fake a login
    localStorage.setItem('auth_token', 'pmuir');
    this.router.navigate(['/home']);
  }

}
