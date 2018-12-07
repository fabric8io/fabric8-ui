import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';


export interface RequestCacheItem {
  asyncResponse: AsyncSubject<HttpResponse<any>>;
  lastRead: number;
}

const CACHE_TTL = 300; // maximum cache age (ms)

@Injectable()
export class RequestCache {

  private cache = new Map<string, RequestCacheItem>();

  get(req: HttpRequest<any>): AsyncSubject<HttpResponse<any>> | undefined {
    const cacheKey = createCacheKey(req);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - CACHE_TTL);
    return isExpired ? undefined : cached.asyncResponse;
  }

  set(req: HttpRequest<any>, asyncResponse: AsyncSubject<HttpResponse<any>>): void {
    const cacheKey = createCacheKey(req);

    const cacheItem = { asyncResponse, lastRead: Date.now() };
    this.cache.set(cacheKey, cacheItem);

    // remove expired cache entries
    const expired = Date.now() - CACHE_TTL;
    this.cache.forEach(cacheItem => {
      if (cacheItem.lastRead < expired) {
        this.cache.delete(cacheKey);
      }
    });
  }
}

// Creates a cache key from headers, query params, and URL
function createCacheKey(req: HttpRequest<any>): string {
  let key = req.urlWithParams;
  if (req.headers) {
    key += `:${JSON.stringify(req.headers.keys().map(key => ({[key]: req.headers.getAll(key)})))}`;
  }
  return key;
}
