import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { UserService } from '../user/user.service';
import { User } from '../models/user';



@Component({
  selector: 'alm-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
      private router: Router, private auth: AuthenticationService, private userService: UserService
    ) {}

  ngOnInit() {}

  complete() {
    // Fake a login
    localStorage.setItem('auth_token', 'pmuir');
    this.router.navigate(['/home']);
  }

}
