import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  // Increase this by one everytime
  // a change is made in the table columns
  datatableColumnVersion = 4;

  constructor() {}

  setCookie(cName: string, cValue: Array<any>) {
    document.cookie =
      cName +
      '=' +
      JSON.stringify({
        version: this.datatableColumnVersion,
        value: cValue,
      });
  }

  getCookie(itemLength: Number) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].includes('datatableColumn')) {
        const data = JSON.parse(cookies[i].split('=')[1]);
        if (Object.keys(data).length === 2) {
          if (
            data['version'] === this.datatableColumnVersion &&
            data['value'].length === itemLength
          ) {
            return { status: true, array: data['value'] };
          }
        }
      }
    }
    return { status: false, array: [] };
  }
}
