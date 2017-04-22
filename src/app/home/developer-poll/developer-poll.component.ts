import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-developer-poll',
  templateUrl: './developer-poll.component.html',
  styleUrls: ['./developer-poll.component.scss'],
})
export class DeveloperPollComponent implements OnInit {
  voted: boolean = false;
  votes: number = 2304;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  vote($event: MouseEvent): void {
    this.votes++;
    this.voted = true;
  }
}
