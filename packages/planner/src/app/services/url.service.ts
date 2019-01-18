import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
  private instance = null;
  constructor() {
    if (sessionStorage.getItem('planner_lastListOrBoardUrl') === null) {
      sessionStorage.setItem('planner_lastListOrBoardUrl', '');
    }
  }

  recordLastListOrBoard(url) {
    sessionStorage.setItem('planner_lastListOrBoardUrl', url);
  }

  getLastListOrBoard() {
    return sessionStorage.getItem('planner_lastListOrBoardUrl');
  }
}
