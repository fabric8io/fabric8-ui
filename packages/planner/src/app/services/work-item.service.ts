import { Inject, Injectable } from '@angular/core';

import { Observable, of as ObservableOf, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Logger } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { Comment } from '../models/comment';

import { HttpErrorResponse } from '@angular/common/http';
import { AreaModel } from '../models/area.model';
import { Link } from '../models/link';
import { LinkTypeService } from '../models/link-type';
import { WorkItem } from '../models/work-item';
import { WorkItemType } from './../models/work-item-type';
import { HttpBackendClient, HttpClientService } from './../shared/http-module/http.service';
import { AreaService } from './area.service';

@Injectable()
export class WorkItemService {
  private workItemUrl: string = null;
  private renderUrl: string = null;

  public workItemTypes: WorkItemType[] = [];
  public _currentSpace;

  constructor(
    private httpClientService: HttpClientService,
    private httpBackendClient: HttpBackendClient,
    private logger: Logger,
    private areaService: AreaService,
    private userService: UserService,
    private spaces: Spaces,
    @Inject(WIT_API_URL) private baseApiUrl: string,
  ) {
    this.spaces.current.subscribe((val) => (this._currentSpace = val));
    this.logger.log('Launching WorkItemService');
  }

  private notifyError(message: string, httpError: any) {
    this.logger.log(
      'ERROR [WorkItemService] ' + message + (httpError.message ? ' ' + httpError.message : ''),
    );
  }

  private handleError(error: Error | any, msg: string) {
    this.notifyError(msg, error);
    return throwError(new Error(error.message));
  }

  /**
   * Takes a URL to the list of child
   * work items of a particular work item
   * and performs a get operation for all the child items
   * @param url url to the child work items
   */
  getChildren(url: string): Observable<WorkItem[]> {
    return this.httpClientService.get<{ data: WorkItem[] }>(url).pipe(
      map((response) => response.data as WorkItem[]),
      catchError((err) => this.handleError(err, 'Getting children failed.')),
    );
  }

  /**
   * Usage: Performs a get operation on work items
   *
   * @param pageSize number of work items to be fetched
   * @param filters filters to the work items
   */
  getWorkItems(
    pageSize: number = 20,
    filters: object,
  ): Observable<{
    workItems: WorkItem[];
    nextLink: string;
    totalCount?: number | null;
    included?: WorkItem[] | null;
    ancestorIDs?: Array<string>;
  }> {
    let url = '';
    this.workItemUrl = this.baseApiUrl + 'search';
    url =
      this.workItemUrl +
      '?page[limit]=' +
      pageSize +
      '&' +
      Object.keys(filters)
        .map((k) => 'filter[' + k + ']=' + encodeURIComponent(JSON.stringify(filters[k])))
        .join('&');
    return this.httpClientService
      .get<{
        data: WorkItem[];
        links: {
          first?: string;
          last?: string;
          next?: string;
        };
        meta: {
          totalCount: number;
          ancestorIDs: string[];
        };
        included: WorkItem[];
      }>(url)
      .pipe(
        map((resp) => {
          return {
            workItems: resp.data as WorkItem[],
            nextLink: resp.links.next ? resp.links.next : null,
            totalCount: resp.meta ? resp.meta.totalCount : 0,
            included: resp.included ? (resp.included as WorkItem[]) : [],
            ancestorIDs: resp.meta.ancestorIDs ? resp.meta.ancestorIDs : [],
          };
        }),
        catchError((error: Error | any) => {
          this.notifyError('Getting work items failed.', error);
          return throwError(new Error(error.message));
        }),
      );
  }

  /**
   * This function is called from next page onwards in the scroll
   * It does pretty much same as the getWorkItems function
   */
  getMoreWorkItems(
    url,
  ): Observable<{
    workItems: WorkItem[];
    nextLink: string | null;
    included?: WorkItem[] | null;
    ancestorIDs?: Array<string>;
  }> {
    if (url) {
      return this.httpClientService
        .get<{
          data: WorkItem[];
          links: { next: string };
          meta: {
            totalCount: number;
            ancestorIDs: string[];
          };
          included: WorkItem[];
        }>(url)
        .pipe(
          map((resp) => {
            return {
              workItems: resp.data as WorkItem[],
              nextLink: resp.links.next ? resp.links.next : null,
              included: resp.included ? (resp.included as WorkItem[]) : [],
              ancestorIDs: resp.meta.ancestorIDs ? resp.meta.ancestorIDs : [],
            };
          }),
          catchError((error: Error | any) => {
            this.notifyError('Getting more work items failed.', error);
            return throwError(new Error(error.message));
          }),
        );
    } else {
      return throwError('No more item found');
    }
  }

  /**
   * Usage: This method gives a single work item by display number.
   *
   * @param id : string - number
   * @param owner : string
   * @param space : string
   */
  getWorkItemByNumber(
    id: string | number,
    owner: string = '',
    space: string = '',
  ): Observable<WorkItem> {
    if (owner && space) {
      return this.httpBackendClient
        .get<{ data: WorkItem }>(
          this.baseApiUrl + 'namedspaces' + '/' + owner + '/' + space + '/workitems/' + id,
        )
        .pipe(
          map((item) => item.data),
          catchError((error: Error | any) => {
            this.notifyError('Getting work item data failed.', error);
            return throwError(new Error(error.message));
          }),
        );
    } else {
      return this.httpClientService
        .get<{ data: WorkItem }>(this.baseApiUrl + 'workitems/' + id)
        .pipe(
          map((i) => i.data),
          catchError((error: Error | any) => {
            this.notifyError('Getting work item data failed.', error);
            return throwError(new Error(error.message));
          }),
        );
    }
  }

  /**
   * Usage: This method is to get the events for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  getEvents(url: string): Observable<any> {
    return this.httpClientService
      .get<{ data: Event[] }>(url)
      .pipe(map((response) => response.data));
  }

  /**
   * Usage: This method is to resolve the comments for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveComments(url: string): Observable<any> {
    return this.httpClientService.get<{ data: Comment[]; meta: any; links: any }>(url).pipe(
      map((response) => {
        return { data: response.data, meta: response.meta, links: response.links };
      }),
    );
  }

  /**
   * Usage: This method is to resolve the linked items for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveLinks(url: string): Observable<any> {
    return this.httpClientService.get<{ data: Link[]; included: Link[] }>(url).pipe(
      map((response) => [response.data as Link[], response.included]),
      catchError((error: Error | any) => {
        this.notifyError('Getting linked items data failed.', error);
        return throwError(new Error(error.message));
      }),
    );
  }

  /**
   * Usage: fetch all the work item types
   *
   * @param workItemTypeUrl : string
   */
  getWorkItemTypes(workItemTypeUrl: string): Observable<any[]> {
    return this.httpClientService.get<{ data: WorkItemType[] }>(workItemTypeUrl).pipe(
      map((response) => {
        // TODO : this line can be removed when
        // getWorkItemTypesById function is removed
        this.workItemTypes = response.data;

        return response.data as WorkItemType[];
      }),
      catchError((error: Error | any) => {
        this.notifyError('Getting work item type information failed.', error);
        return throwError(new Error(error.message));
      }),
    );
  }

  /**
   * Usage: This method deletes an work item
   *  @param workItem WorkItem
   */
  delete(workItem: WorkItem): Observable<any> {
    let endpoint = workItem.links.self;
    return this.httpClientService.delete(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notifyError('Deleting workitem failed.', error);
        return throwError(error);
      }),
    );
  }

  /**
   * Usage: This method create a new item
   *
   * @param: url
   * @param: WorkItem - workItem (Item to be created)
   */
  create(url: string, workItem: WorkItem): Observable<WorkItem> {
    let payload = JSON.stringify({ data: workItem });
    return this.httpClientService
      .post<{ data: WorkItem }>(url, payload)
      .pipe(map((response) => response.data as WorkItem));
  }

  /**
   * Usage: This method update an existing item
   * updates the item in the big list
   * resolve the users for the item
   *
   * @param: WorkItem - workItem (Item to be created)
   */
  update(workItem: WorkItem): Observable<WorkItem> {
    return this.httpClientService
      .patch<{ data: WorkItem }>(workItem.links.self, JSON.stringify({ data: workItem }))
      .pipe(
        map((response) => {
          return response.data;
        }),
        catchError((error: Error | any) => {
          this.notifyError('Updating work item failed.', error);
          return throwError(new Error(error.message));
        }),
      );
  }

  /**
   * Usage: This method create a comment for a workItem
   *
   * @param: string - id (Work Item ID)
   * @param: Comment
   */
  createComment(url: string, comment: Comment): Observable<Comment> {
    return this.httpClientService.post<{ data: Comment }>(url, { data: comment }).pipe(
      map((response) => {
        return response.data as Comment;
      }),
      catchError((error: Error | any) => {
        this.notifyError('Creating comment failed.', error);
        return throwError(new Error(error.message));
      }),
    );
  }

  /**
   * Usage: to update comment pass in with the ID
   *
   * @param comment Comment type
   */
  updateComment(comment: Comment): Observable<Comment> {
    let endpoint = comment.links.self;
    return this.httpClientService.patch<{ data: Comment }>(endpoint, { data: comment }).pipe(
      map((response) => {
        let comment: Comment = response.data as Comment;
        let theUser: User = this.userService.getSavedLoggedInUser();
        comment.relationalData = { creator: theUser };
        return comment;
      }),
      catchError((error: Error | any) => {
        this.notifyError('Updating comment failed.', error);
        return throwError(new Error(error.message));
      }),
    );
  }

  /**
   * Usage: To delete a comment
   * @param comment Comment
   */
  deleteComment(comment: Comment): Observable<any> {
    let endpoint = comment.links.self;
    return this.httpClientService.delete(endpoint).pipe(
      catchError((error: Error | any) => {
        this.notifyError('Deleting comment failed.', error);
        return throwError(new Error(error.message));
      }),
    );
  }

  /**
   * Usage: This function fetches all the work item link types
   * Store it in an instance variable
   *
   * @return Promise of LinkType[]
   */
  getAllLinkTypes(url: string): Observable<LinkTypeService[]> {
    return this.httpClientService.get<{ data: LinkTypeService[] }>(url).pipe(
      map((d) => d.data),
      catchError((error: Error | any) => {
        this.notifyError('Getting link meta info failed (forward).', error);
        return throwError(new Error(error.message));
      }),
    );
  }

  /**
   * Usage: Makes an API call to create a link
   * Recieves the new link response
   * Resolves and add the new link to the workItem
   *
   * @param link: Link - The new link object for request params
   * @returns Promise<Link>
   */
  createLink(url: string, link: Object): Observable<any> {
    return this.httpClientService
      .post<{ data: Link; included: any }>(url, JSON.stringify(link))
      .pipe(map((response) => [response.data as Link, response.included]));
  }

  /**
   * Usage: Makes an API call to delete a link
   * Removes the new link to the workItem
   *
   * @param link: Link
   * @returns Promise<void>
   */
  deleteLink(url: string): Observable<void> {
    return this.httpClientService.delete(url);
  }

  searchLinkWorkItem(term: string, spaceId: string): Observable<WorkItem[]> {
    let searchUrl = this.baseApiUrl + 'search?spaceID=' + spaceId + '&q=' + term;
    return this.httpClientService
      .get<{ data: WorkItem[] }>(searchUrl)
      .pipe(map((response) => response.data as WorkItem[]));
  }

  /**
   * Usage: Make a API call to save
   * the order of work item.
   *
   * @param spaceLink: string
   * @param workItemId: string
   * @param prevWiId: string
   * @param direction: string
   */
  reOrderWorkItem(
    spaceLink: string,
    workItem: WorkItem,
    prevWiId: string | null = null,
    direction: string,
  ): Observable<WorkItem> {
    let newWItem = new WorkItem();
    let arr = [];
    newWItem.id = workItem.id.toString();
    newWItem.attributes = new Map<string, string | number>();
    newWItem.attributes['version'] = workItem.attributes['version'];
    newWItem.type = workItem.type;
    arr.push(newWItem);
    let url = `${spaceLink}/workitems/reorder`;
    return this.httpClientService
      .patch<{ data: WorkItem }>(
        url,
        JSON.stringify({ data: arr, position: { direction: direction, id: prevWiId } }),
      )
      .pipe(
        map((response) => response.data[0] as WorkItem),
        catchError((err) => ObservableOf(newWItem as WorkItem)),
      );
  }

  /**
   * Usage: This function is used to render markdown text in html
   * @param markDownText string
   */
  renderMarkDown(markDownText: string): Observable<any> {
    let params = {
      data: {
        attributes: {
          content: markDownText,
          markup: 'Markdown',
        },
        type: 'rendering',
      },
    };

    // FIXME: make the URL great again (when we know the right API URL for this)!
    this.renderUrl = this.baseApiUrl + 'render';
    return this.httpClientService
      .post<{ data: any }>(this.renderUrl, JSON.stringify(params))
      .pipe(map((response) => response.data.attributes.renderedContent));
  }

  /**
   * All the soon to be deprecated method stays behind this line
   */

  /**
   * @deprecated Planner :: this property will be deprecated soon
   */
  private userIdMap = {};

  /**
   * @deprecated Planner :: this function will be deprecated soon
   * @function buildUserIdMap builds a ID-User map to dynamically access list of users
   * This method takes the locally saved list of users from User Service
   * Before coming to this method we fetch the list of users using router resolver
   * in detail and list component.
   */
  buildUserIdMap(): void {
    // Fetch the current updated locally saved user list
    let users: User[] = this.userService.getLocallySavedUsers() as User[];
    // Check if the map is putdated or not and if yes then rebuild it
    if (Object.keys(this.userIdMap).length < users.length) {
      this.userIdMap = {};
      users.forEach((user) => {
        this.userIdMap[user.id] = user;
      });
    }
  }

  /**
   * @deprecated Planner :: we save all the types in the store in a key - value pair.
   * Therefore, this function is not needed anymore.
   *
   * Usage: This method is to fetch the work item types by ID
   */

  getWorkItemTypesById(id: string): Observable<WorkItemType> {
    if (this._currentSpace && typeof id !== 'undefined') {
      let workItemType = this.workItemTypes
        ? this.workItemTypes.find((type) => type.id === id)
        : null;
      if (workItemType) {
        return ObservableOf(workItemType);
      } else {
        let workItemTypeUrl =
          this._currentSpace.links.self.split('/spaces/')[0] + '/workitemtypes/' + id;
        return this.httpClientService.get<{ data: WorkItemType }>(workItemTypeUrl).pipe(
          map((response) => {
            workItemType = response.data as WorkItemType;
            if (this.workItemTypes) {
              let existingType = this.workItemTypes.find((type) => type.id === workItemType.id);
              if (existingType) {
                existingType = workItemType;
              } else {
                this.workItemTypes.push(workItemType);
              }
            }
            return workItemType;
          }),
          catchError((error: Error | any) => {
            this.notifyError('Getting work item type info failed.', error);
            return throwError(new Error(error.message));
          }),
        );
      }
    } else {
      return ObservableOf<WorkItemType>({} as WorkItemType);
    }
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Resolving relations is moved to querries
   *
   * Usage: Resolve the wi type for a WorkItem
   */
  resolveType(workItem: WorkItem): void {
    this.getWorkItemTypesById(workItem.relationships.baseType.data.id).subscribe(
      (type: WorkItemType) => {
        workItem.relationships.baseType.data = type;
      },
    );
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Usage: Fetch an area by it's ID from the areas list
   */
  getAreaById(areaId: string): Observable<AreaModel> {
    return this.areaService
      .getAreas()
      .pipe(map((areas) => areas.find((item) => item.id == areaId)));
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Resolving relations is moved to querries
   *
   * Usage: To resolve the areas in eact WorkItem
   * For now it resolves assignne and creator
   */
  resolveAreaForWorkItem(workItem: WorkItem): void {
    if (!workItem.hasOwnProperty('relationalData')) {
      workItem.relationalData = {};
    }
    if (!workItem.relationships.hasOwnProperty('area') || !workItem.relationships.area) {
      workItem.relationalData.area = null;
      return;
    }
    if (!workItem.relationships.area.hasOwnProperty('data')) {
      workItem.relationalData.area = null;
      return;
    }
    if (!workItem.relationships.area.data) {
      workItem.relationalData.area = null;
      return;
    }
    this.getAreaById(workItem.relationships.area.data.id).subscribe(
      (area) => (workItem.relationalData.area = area),
    );
  }

  /**
   * @deprecated Planner ::
   * Usage: Fetch an use by it's ID from the User-ID map
   */
  getUserById(userId: string): User {
    if (userId in this.userIdMap) {
      return this.userIdMap[userId];
    } else {
      return null;
    }
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Resolving relations is moved to querries
   * Usage: Resolve the creator for a WorkItem
   */
  resolveCreator(workItem: WorkItem): void {
    if (!workItem.relationships.hasOwnProperty('creator') || !workItem.relationships.creator) {
      workItem.relationalData.creator = null;
      return;
    }
    if (!workItem.relationships.creator.hasOwnProperty('data')) {
      workItem.relationalData.creator = null;
      return;
    }
    if (!workItem.relationships.creator.data) {
      workItem.relationalData.creator = null;
      return;
    }
    // To handle some old items with no creator
    if (workItem.relationships.creator.data.id === 'me') {
      workItem.relationalData.creator = null;
      return;
    }
    workItem.relationalData.creator = this.getUserById(workItem.relationships.creator.data.id);
  }
}
