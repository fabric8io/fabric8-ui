import { TestBed } from '@angular/core/testing';

import { Logger } from 'ngx-base';

import { CopyService } from './copy.service';

describe('CopyService', () => {

  let service: CopyService;
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockElement: any = document.createElement('textarea');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CopyService,
        { provide: Logger, useValue: mockLogger }
      ]
    });
    service = TestBed.get(CopyService);
    spyOn(service.dom, 'createElement').and.returnValue(mockElement);
  });

  describe('#copy', () => {
    it('should create a textarea dom element', () => {
      service.copy('foobar');
      expect(service.dom.createElement).toHaveBeenCalledWith('textarea');
    });

    it('should assign the value of the textarea to be the passed string', () => {
      service.copy('foobar');
      expect(mockElement.value).toBe('foobar');
    });

    it('should return true if the dom copy command has succeeded', () => {
      spyOn(service.dom, 'execCommand').and.returnValue(true);
      let result = service.copy('foobar');
      expect(result).toBeTruthy();
    });

    it('should return false and log any errors if the dom copy command has failed', () => {
      spyOn(service.dom, 'execCommand').and.throwError('mock-error');
      let result = service.copy('foobar');
      expect(mockLogger.error).toHaveBeenCalledWith(Error('mock-error'));
      expect(result).toBeFalsy();
    });
  });

});
