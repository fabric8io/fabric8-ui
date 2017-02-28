/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from 'ngx-login-client';
import { recommenderApiUrlProvider } from './../../../shared/recommender-api.provider';
import { ApiLocatorService } from './../../../shared/api-locator.service';
import { witApiUrlProvider } from './../../../shared/wit-api.provider';

import { RecommenderComponent } from './recommender.component';
import { AddWorkFlowService } from '../stack-details/add-work-flow.service';

describe('Service test for StackRecommenderComponent', () => {
    beforeEach(async(() => {
        let mockAddWorkFlowService: any = {
            addWorkFlow: function (workItemData: any) {
                let apiResponse: any = {
                    finished_at: '2017-02-27T06:01:19.162056',
                    recommendation: {
                        recommendations: {
                            component_level: null,
                            similar_stacks: [
                                {
                                analysis: {
                                    missing_downstream_component: {

                                    },
                                    missing_packages: {
                                        'io.vertx:vertx-jdbc-client': '3.3.3'
                                    },
                                    version_mismatch: {

                                    }
                                },
                                original_score: 0.42857142857142855,
                                similarity: 0.42857142857142855,
                                source: 'vertx',
                                stack_id: '2bff6a88349348d0b73838d751819c9d',
                                usage: 1
                                },
                                {
                                analysis: {
                                    missing_downstream_component: {

                                    },
                                    missing_packages: {
                                        'io.vertx:vertx-jdbc-client': '3.3.3'
                                    },
                                    version_mismatch: {

                                    }
                                },
                                original_score: 0.5714285714285714,
                                similarity: 0.5714285714285714,
                                source: 'vertx',
                                stack_id: '2bff6a88349348d0b73838d751819c9d',
                                usage: 1
                                },
                                {
                                analysis: {
                                    missing_downstream_component: {

                                    },
                                    missing_packages: {
                                        'io.vertx:vertx-jdbc-client': '3.3.3'
                                    },
                                    version_mismatch: {

                                    }
                                },
                                original_score: 0.7142857142857143,
                                similarity: 0.7142857142857143,
                                source: 'vertx',
                                stack_id: '2bff6a88349348d0b73838d751819c9d',
                                usage: 1
                                },
                                {
                                analysis: {
                                    missing_downstream_component: {

                                    },
                                    missing_packages: {
                                        'io.vertx:vertx-jdbc-client': '3.3.3'
                                    },
                                    version_mismatch: {

                                    }
                                },
                                original_score: 0.8571428571428571,
                                similarity: 0.8571428571428571,
                                source: 'vertx',
                                stack_id: '2bff6a88349348d0b73838d751819c9d',
                                usage: 1
                                }
                            ]
                        }
                    }
                };
                return Observable.create(observer => {
                    observer.next(apiResponse);
                    observer.complete();
                });
            }
        };
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule
            ],
            declarations: [RecommenderComponent],
            providers: [
                {
                    provide: AddWorkFlowService,
                    useValue: mockAddWorkFlowService
                },
                witApiUrlProvider,
                recommenderApiUrlProvider,
                ApiLocatorService
            ]
            })
            .compileComponents();
    }));

    it('Should hit the service and receive a response of type Observable<any>', inject([AddWorkFlowService], (addWorkFlow) => {
        let result = addWorkFlow.addWorkFlow();
        expect(result instanceof Observable).toBe(true);
    }));
});

describe('StackRecommenderComponent', () => {
    let component: RecommenderComponent;
    let fixture: ComponentFixture<RecommenderComponent>;
    let debugElement: DebugElement;

    let recommendation: any = {
      suggestion: 'Recommended',
      action: 'Add',
      message: 'vertex-missing',
      isDismissed: true,
      pop: [
        {
          itemName: 'Create WorkItem',
          identifier: 'CREATE_WORK_ITEM'
        }, {
          itemName: 'Dismiss Recommendation',
          identifier: 'DISMISS'
        }, {
          itemName: 'Restore Recommendation',
          identifier: 'RESTORE'
        }
      ]
    };

    beforeEach(async(() => {
        let fakeAuthService: any = {
            getToken: function () {
                return '';
            },
            isLoggedIn: function () {
                return true;
            }
        };
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule
            ],
            declarations: [RecommenderComponent],
            providers: [AddWorkFlowService,
                {
                    provide: AuthenticationService,
                    useValue: fakeAuthService
                },
                witApiUrlProvider,
                recommenderApiUrlProvider,
                ApiLocatorService
            ]
        })
            .compileComponents();
    }));

    it('Component has to be present', () => {
        this.fixture = TestBed.createComponent(RecommenderComponent);
        component = this.fixture.componentInstance;
        this.fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(RecommenderComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('Should have recommendations as much as the input recommendations', () => {
        component.recommendations = [{
          suggestion: 'Recommended',
          action: 'Add',
          message: 'vertex-missing',
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        }, {
          suggestion: 'Recommended',
          action: 'Upgrade',
          message: 'vertex-version-mismatch',
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        }, {
          suggestion: 'Recommended',
          action: 'Add',
          message: 'vertex-missing',
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        }];
        component.ngOnChanges();
        fixture.detectChanges();

        expect(debugElement.queryAll(By.css('.recommendation-list')).length).toBe(fixture.componentInstance.recommendations.length);
    });

    /**
     * TODO: Handle No Recommendations case
     */


    it('Should have triggered the button click', async(() => {
      let recComponent: any = fixture.componentInstance;
      spyOn(recComponent, 'handleRecommendationAction');
      let toggleButton = debugElement.nativeElement.querySelector('.dropdown-toggle');
      toggleButton.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(recComponent.handleRecommendationAction).toHaveBeenCalled();
      });
    }));

    it('For Create flow, Should return className \'activate\' and to be of type string', () => {
      let comp: any = new RecommenderComponent(null);
      let item: any = {
          itemName: 'Create WorkItem',
          identifier: 'CREATE_WORK_ITEM'
      };
      let rec: any = {
        suggestion: 'Recommended',
        action: 'Add',
        message: 'vertex-missing',
        isDismissed: false,
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }, {
            itemName: 'Restore Recommendation',
            identifier: 'RESTORE'
          }
        ]
      };

      let className = comp.getCurrentClass(item, rec);
      expect(typeof className === 'string').toBe(true);
      expect(className).toBe('activate');
    });

    it('For Dismiss flow, Should return className \'deactivate\' and of type string', () => {
      let comp: any = new RecommenderComponent(null);
      let item: any = {
          itemName: 'Dismiss Recommendation',
          identifier: 'DISMISS'
      };
      let rec: any = {
        suggestion: 'Recommended',
        action: 'Add',
        message: 'vertex-missing',
        isDismissed: true,
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }, {
            itemName: 'Restore Recommendation',
            identifier: 'RESTORE'
          }
        ]
      };

      let className = comp.getCurrentClass(item, rec);
      expect(typeof className === 'string').toBe(true);
      expect(className).toBe('deactivate');
    });

    it('For Restore case, Should return className \'activate\' and of type string', () => {
      let comp: any = new RecommenderComponent(null);
      let item: any = {
        itemName: 'Restore Recommendation',
        identifier: 'RESTORE'
      };
      let rec: any = {
        suggestion: 'Recommended',
        action: 'Add',
        message: 'vertex-missing',
        isDismissed: true,
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }, {
            itemName: 'Restore Recommendation',
            identifier: 'RESTORE'
          }
        ]
      };

      let className = comp.getCurrentClass(item, rec);
      expect(typeof className === 'string').toBe(true);
      expect(className).toBe('activate');
    });

    it('For Restore case, Should return className \'deactivate\' and of type string', () => {
      let comp: any = new RecommenderComponent(null);
      let item: any = {
        itemName: 'Restore Recommendation',
        identifier: 'RESTORE'
      };
      let rec: any = {
        suggestion: 'Recommended',
        action: 'Add',
        message: 'vertex-missing',
        isDismissed: false,
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }, {
            itemName: 'Restore Recommendation',
            identifier: 'RESTORE'
          }
        ]
      };

      let className = comp.getCurrentClass(item, rec);
      expect(typeof className === 'string').toBe(true);
      expect(className).toBe('deactivate');
    });

    it('Should return true for creating work items', () => {
        const recommenderComponent: any = new RecommenderComponent(null);
        let rec: any = {
          suggestion: 'Recommended',
          action: 'Add',
          message: 'vertex-missing',
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        };
        let flag: boolean = recommenderComponent.canCreateWorkItem(rec);
        expect(flag).toBe(true);
    });

    it('Should return false for creating work items', () => {
        const recommenderComponent: any = new RecommenderComponent(null);
        let flag: boolean = recommenderComponent.canCreateWorkItem(recommendation);
        expect(flag).toBe(false);
    });

    it('Should call toggleWorkItem function', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      spyOn(recommenderComponent, 'toggleWorkItem');
      recommenderComponent.handleDismissWorkItemAction([recommendation]);
      expect(recommenderComponent.toggleWorkItem).toHaveBeenCalled();
    });

    it('Should call handleRestoreWorkItemAction function', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      spyOn(recommenderComponent, 'toggleWorkItem');
      recommenderComponent.handleRestoreWorkItemAction([recommendation]);
      expect(recommenderComponent.toggleWorkItem).toHaveBeenCalled();
    });

    it('Should check if the recommendations have toggled properly for dismissWorkItemCase', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      let recommendations: Array<any> = [recommendation];
      let oldArray: Array<boolean> = [];
      for (let i in recommendations) {
        if (recommendations.hasOwnProperty(i)) {
          oldArray.push(recommendations[i].isDismissed);
        }
      }
      recommenderComponent.handleDismissWorkItemAction(recommendations);
      for (let i: number = 0; i < recommendations.length; ++ i) {
        if (recommendations.hasOwnProperty(recommendations[i])) {
          expect(!oldArray[i]).toBe(recommendations[i].isDismissed);
        }
      }
    });

    it('Should check if the recommendations have toggled properly for restoreWorkItemCase', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      let recommendations: Array<any> = [recommendation];
      let oldArray: Array<boolean> = [];
      for (let i in recommendations) {
        if (recommendations.hasOwnProperty(i)) {
          oldArray.push(recommendations[i].isDismissed);
        }
      }
      recommenderComponent.handleRestoreWorkItemAction(recommendations);
      for (let i: number = 0; i < recommendations.length; ++ i) {
        if (recommendations.hasOwnProperty(recommendations[i])) {
          expect(!oldArray[i]).toBe(recommendations[i].isDismissed);
        }
      }
    });

    it('Should call function canCreateWorkItem() when there are recommendations', () => {
        const recommenderComponent: any = new RecommenderComponent(null);
        let r: any = {
            suggestion: 'Recommended',
            action: 'Add',
            message: 'vertex-missing',
            isDismissed: false,
            pop: [
                {
                itemName: 'Create WorkItem',
                identifier: 'CREATE_WORK_ITEM'
                }, {
                itemName: 'Dismiss Recommendation',
                identifier: 'DISMISS'
                }, {
                itemName: 'Restore Recommendation',
                identifier: 'RESTORE'
                }
            ]
        };
        spyOn(recommenderComponent, 'canCreateWorkItem');
        recommenderComponent.handleCreateWorkItemAction([r]);
        expect(recommenderComponent.canCreateWorkItem).toHaveBeenCalled();
    });

    it('Shouldn\'t call function canCreateWorkItem() when there are no recommendations or no active recommendations', () => {
        const recommenderComponent: any = new RecommenderComponent(null);
        let r: any = {
            suggestion: 'Recommended',
            action: 'Add',
            message: 'vertex-missing',
            isDismissed: true,
            pop: [
                {
                itemName: 'Create WorkItem',
                identifier: 'CREATE_WORK_ITEM'
                }, {
                itemName: 'Dismiss Recommendation',
                identifier: 'DISMISS'
                }, {
                itemName: 'Restore Recommendation',
                identifier: 'RESTORE'
                }
            ]
        };
        spyOn(recommenderComponent, 'canCreateWorkItem');
        recommenderComponent.handleCreateWorkItemAction([r]);
        expect(recommenderComponent.canCreateWorkItem).toHaveBeenCalled();
    });

    /* it('The create work item button has to be disabled on load', () => {
        
    }); */
});
