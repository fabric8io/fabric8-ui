import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'alm-backlog',
  templateUrl: 'backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  public isCollapsed: boolean;
  public currentList: string;
  private space: string = 'BalloonPopGame';
  private keyPrefix = 'plan.backlog.sidebar';
  private isCollapsedKey = this.keyPrefix + '.' + this.space + '.collapsed';
  private currentListKey = this.keyPrefix + '.' + this.space + '.currentList';

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService) {
  }

  public collapsed(event: any): void {
    this.localStorageService.set(this.isCollapsedKey, this.isCollapsed);
  }

  public selectList(list: string): void {
    this.currentList = list;
    this.localStorageService.set(this.currentListKey, this.currentList);
  }

  ngOnInit() {
    this.isCollapsed = this.localStorageService.get<boolean>(this.isCollapsedKey) || false;
    this.currentList = this.localStorageService.get<string>(this.currentListKey) || 'backlog';
  }



}


