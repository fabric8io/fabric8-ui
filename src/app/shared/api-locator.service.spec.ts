import { BaseApiLocatorService, ApiLocatorService } from './api-locator.service';
import { Fabric8UIConfig } from './config/fabric8-ui-config';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderService } from './account/provider.service';

@Component({
  selector: 'app-apilocatorservicecomp',
  template: ''
})
export class TestAPILocatorServiceComponent {
  constructor(
    public apilocator: ApiLocatorService) {
  }
}

class ApiLocatorServiceTest extends BaseApiLocatorService {
  get(type: string): string {
    return this.buildApiUrl(type);
  }
}


describe('API Locator Service', function() {

  var base = function() {
    return window.location.hostname + ':' + window.location.port;
  };
  var url = function(base: string) {
    return 'http://' + base;
  };

  it('Add prefix to configured service URL', function() {
    var loc = new ApiLocatorServiceTest(new Fabric8UIConfig(), new Map([['random_test', 'api']]), new Map());
    expect(loc.get('random_test')).toMatch(url('api.' + base()));
  });

  it('Add suffix to configured service URL', function() {
    var loc = new ApiLocatorServiceTest(new Fabric8UIConfig(), new Map(), new Map([['random_test', 'api']]));
    expect(loc.get('random_test')).toMatch(url(base() + '/api'));
  });

  it('Add prefix and suffix to configured service URL', function() {
    var loc = new ApiLocatorServiceTest(new Fabric8UIConfig(), new Map([['random_test', 'api']]), new Map([['random_test', 'api']]));
    expect(loc.get('random_test')).toMatch(url('api.' + base() + '/api'));
  });

  it('Do not change non configured service URL', function() {
    var loc = new ApiLocatorServiceTest(new Fabric8UIConfig(), new Map(), new Map());
    expect(loc.get('random_test')).toMatch(url(base()));
  });

  it('Ensure APILocatorService is injectable', function() {
    TestBed.configureTestingModule({
      declarations: [TestAPILocatorServiceComponent],
      providers: [ApiLocatorService, Fabric8UIConfig, ProviderService]
    });
    var fixture = TestBed.createComponent(TestAPILocatorServiceComponent);
    var comp = fixture.componentInstance;
    expect(comp.apilocator).toBeTruthy();
  });
});
