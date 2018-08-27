import { Injectable } from '@angular/core';

import { HttpRequest, HttpResponse } from '@angular/common/http';


export interface RequestCacheEntry {
  url: string;
  response: HttpResponse<any>;
  lastRead: number;
}

export interface RequestCache {
  get(req: HttpRequest<any>): HttpResponse<any> | undefined;
  set(req: HttpRequest<any>, response: HttpResponse<any>): void;
}

const maxAge = 300000; // maximum cache age (ms)

@Injectable()
export class RequestCacheWithMap implements RequestCache {

  cache = new Map<string, RequestCacheEntry>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);
    console.log(`Found cached response for ${url}`);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    const expired = isExpired ? 'expired ' : '';
    console.log(`Found ${expired}cached response for "${url}".`);
    return isExpired ? undefined : cached.response;
  }

  set(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    console.log(`Caching response from "${url}".`);

    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    // remove expired cache entries
    const expired = Date.now() - maxAge;
    this.cache.forEach(entry => {
      if (entry.lastRead < expired) {
        this.cache.delete(entry.url);
      }
    });

    console.log(`Request cache size: ${this.cache.size}.`);
  }
}
