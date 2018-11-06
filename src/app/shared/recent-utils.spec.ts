
import { ErrorHandler } from '@angular/core';
import { EMPTY, throwError } from 'rxjs';
import { ExtProfile, ProfileService } from '../profile/profile.service';
import { RecentUtils } from './recent-utils';

class RecentImpl extends RecentUtils<string> {
  compareElements(a: string, b: string) {
    return a === b;
  }
}

const MockProfileService = jest.fn<ProfileService>().mockImplementation(() => {
  return { silentSave: jest.fn().mockReturnValue(EMPTY) };
});

const MockErrorHandler = jest.fn<ErrorHandler>().mockImplementation(() => {
  return { handleError: jest.fn() };
});

describe('recent-utils', () => {

  let errorHandlerMock: ErrorHandler;
  let profileServiceMock: ProfileService;
  let subject: RecentUtils<string>;

  beforeEach(() => {
    errorHandlerMock = new MockErrorHandler();
    profileServiceMock = new MockProfileService();
    subject = new RecentImpl(errorHandlerMock, profileServiceMock);
  });

  describe('onBroadcastChanged', () => {
    it('should not require saving if item already at start of list', () => {
      expect(subject.onBroadcastChanged('a', ['a', 'b'])).toEqual({
        recent: ['a', 'b'],
        isSaveRequired: false
      });
    });

    it('should bump existing item to front of list', () => {
      expect(subject.onBroadcastChanged('a', ['b', 'a'])).toEqual({
        recent: ['a', 'b'],
        isSaveRequired: true
      });
    });

    it('should add new items to the start of the list', () => {
      expect(subject.onBroadcastChanged('b', ['a', 'c'])).toEqual({
        recent: ['b', 'a', 'c'],
        isSaveRequired: true
      });
    });

    it('should limit list to 8 entries', () => {
      expect(subject.onBroadcastChanged('z', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])).toEqual({
        recent: ['z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        isSaveRequired: true
      });
    });
  });

  describe('onBroadcastDeleted', () => {
    it('should should not requiring saving if item is missing', () => {
      expect(subject.onBroadcastDeleted('a', [])).toEqual({
        recent: [],
        isSaveRequired: false
      });
    });

    it('should remove items from the list', () => {
      expect(subject.onBroadcastDeleted('b', ['a', 'b', 'c'])).toEqual({
        recent: ['a', 'c'],
        isSaveRequired: true
      });
    });

    it('should support custom comparator', () => {
      const comparator = (a: string, b: any) => a === b.value;
      expect(subject.onBroadcastDeleted({ value: 'b'}, ['a', 'b', 'c'], comparator)).toEqual({
        recent: ['a', 'c'],
        isSaveRequired: true
      });
    });
  });

  it('save profile success', () => {
    subject.saveProfile({} as ExtProfile);
    expect(profileServiceMock.silentSave).toHaveBeenCalled();
    expect(errorHandlerMock.handleError).not.toHaveBeenCalled();
  });

  it('save profile error', () => {
    const error = new Error();
    profileServiceMock.silentSave = jest.fn().mockReturnValue(throwError(error));
    subject.saveProfile({} as ExtProfile);
    expect(profileServiceMock.silentSave).toHaveBeenCalled();
    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });
});
