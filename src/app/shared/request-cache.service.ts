import { Injectable } from '@angular/core';

import { HttpRequest, HttpResponse } from '@angular/common/http';
import { AsyncSubject } from 'rxjs';


export interface RequestCacheItem {
  asyncResponse: AsyncSubject<HttpResponse<any>>;
  lastRead: number;
}

const CACHE_TTL = 300; // maximum cache age (ms)

@Injectable()
export class RequestCache {

  cache = new Map<string, RequestCacheItem>();

  get(req: HttpRequest<any>): AsyncSubject<HttpResponse<any>> | undefined {
    const cacheKey = createCacheKey(req);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - CACHE_TTL);
    const expired = isExpired ? 'expired ' : '';
    console.log(`Found ${expired}cached response for "${req.url}".`);
    return isExpired ? undefined : cached.asyncResponse;
  }

  set(req: HttpRequest<any>, asyncResponse: AsyncSubject<HttpResponse<any>>): void {
    const cacheKey = createCacheKey(req);
    console.log(`Caching response from "${req.url}".`);

    const cacheItem = { asyncResponse, lastRead: Date.now() };
    this.cache.set(cacheKey, cacheItem);

    // remove expired cache entries
    const expired = Date.now() - CACHE_TTL;
    this.cache.forEach(cacheItem => {
      if (cacheItem.lastRead < expired) {
        this.cache.delete(cacheKey);
      }
    });

    console.log(`Request cache size: ${this.cache.size}.`);
  }
}

// Creates a cache key from headers, query params, and URL
function createCacheKey(req: HttpRequest<any>): string {
  let key;
  key = req.urlWithParams;
  if (req.headers) {
    key += `:${JSON.stringify(req.headers)}`;
  }
  return key;
}
