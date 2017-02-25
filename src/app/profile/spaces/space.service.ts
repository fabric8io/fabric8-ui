import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { cloneDeep } from 'lodash';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, Logger } from 'ngx-login-client';

import { Space } from '../../models/space';

@Injectable()
export class SpaceService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl;
  private nextLink: string = null;

  // Array of all spaces that have been retrieved from the REST API.
  private spaces: Space[] = [];
  // Map of space instances with key = spaceId, and
  // value = array index of space in spaces array instance.
  private spaceIdIndexMap = {};

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.spacesUrl = apiUrl + 'spaces';
  }

  getSpaces(pageSize: number = 20): Promise<Space[]> {
    let url = this.spacesUrl + '?page[limit]=' + pageSize;
    let isAll = true;
    return this.getSpacesDelegate(url, isAll);
  }

  getSpaceByName(spaceName: string): Promise<Space> {
    let result = this.spaces.find(space => space.attributes.name === spaceName);
    if (result == null) {
      let url = `${this.spacesUrl}/${spaceName}`;
      return this.http.get(url, { headers: this.headers } )
        .toPromise()
        .then((response) => {
          let space: Space = response.json().data as Space;
          this.spaces.splice(this.spaces.length, 0, space);
          this.buildSpaceIndexMap();
          return space;
        })
        .catch (this.handleError);
    } else {
      return Promise.resolve(result);
    }
  }

  getMoreSpaces(): Promise<any> {
    if (this.nextLink) {
      let isAll = false;
      return this.getSpacesDelegate(this.nextLink, isAll);
    } else {
      return Promise.reject('No more item found');
    }
  }

  getSpacesDelegate(url: string, isAll: boolean): Promise<any> {
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(response => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        let links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        // Extract data from JSON API response, and assert to an array of spaces.
        let newSpaces: Space[] = response.json().data as Space[];
        let newItems = cloneDeep(newSpaces);
        // Update the existing spaces list with new data
        this.updateSpacesList(newItems);
        if (isAll) {
          return this.spaces;
        } else {
          return newSpaces;
        }
      })
      .catch(this.handleError);
  }

  create(space: Space): Promise<Space> {
    let url = this.spacesUrl;
    let payload = JSON.stringify({ data: space });
    return this.http
      .post(url, payload, { headers: this.headers })
      .toPromise()
      .then(response => {
        let newSpace: Space = response.json().data as Space;
        // Add the newly created space at the top of the spaces list.
        this.spaces.splice(0, 0, newSpace);
        // Rebuild the map after updating the list
        this.buildSpaceIndexMap();
        return newSpace;
      }).catch(this.handleError);
  }

  // Adds or updates the client-local list of spaces,
  // with spaces retrieved from the server, usually as a page in a paginated collection.
  // If a space already exists in the client-local collection,
  // then it's attributes are updated to the values fetched from the server.
  // If a space did not exist in the client-local collection, then the space is inserted.
  private updateSpacesList(spaces: Space[]): void {
    spaces.forEach((space) => {
      if (space.id in this.spaceIdIndexMap) {
        this.spaces[this.spaceIdIndexMap[space.id]].attributes =
          cloneDeep(space.attributes);
      } else {
        this.spaces
          .splice(this.spaces.length, 0, space);
      }
    });
    // Re-build the map once done updating the list
    this.buildSpaceIndexMap();
  }

  private buildSpaceIndexMap(): void {
    this.spaces.forEach((space, index) => {
      this.spaceIdIndexMap[space.id] = index;
    });
  }

  private handleError(error: any): Promise<any> {
    this.logger.error(error);
    return Promise.reject(error.message || error);
  }
}
